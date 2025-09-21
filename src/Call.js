import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://voice-calling-server.onrender.com');

export default function Call() {
    const [status, setStatus] = useState('idle'); // idle, searching, inCall
    const [time, setTime] = useState(0);
    const [muted, setMuted] = useState(false);

    const localRef = useRef();
    const remoteRef = useRef();
    const pcRef = useRef();
    const intervalRef = useRef();
    const partnerRef = useRef();

    useEffect(() => {
        socket.on('searching', () => setStatus('searching'));

        socket.on('call-found', async ({ partnerId }) => {
            setStatus('inCall');
            partnerRef.current = partnerId;
            await startCall(partnerId);
            intervalRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
        });

        socket.on('signal', async ({ signal, from }) => {
            if (!pcRef.current) return;

            if (signal.type === 'offer') {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
                const answer = await pcRef.current.createAnswer();
                await pcRef.current.setLocalDescription(answer);
                socket.emit('signal', { signal: answer, partnerId: from });
            } else if (signal.type === 'answer') {
                if (pcRef.current.signalingState === 'have-local-offer') {
                    await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
                }
            } else if (signal.candidate) {
                try {
                    await pcRef.current.addIceCandidate(signal);
                } catch (err) {
                    console.log('ICE candidate error:', err);
                }
            }
        });

        socket.on('call-ended', () => {
            if (pcRef.current) pcRef.current.close();
            setStatus('idle');
            setTime(0);
            clearInterval(intervalRef.current);
        });

        return () => clearInterval(intervalRef.current);
    }, []);

    const startCall = async (partnerId) => {
        pcRef.current = new RTCPeerConnection();
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localRef.current.srcObject = localStream;
        localStream.getTracks().forEach(track => pcRef.current.addTrack(track, localStream));

        pcRef.current.ontrack = (e) => {
            remoteRef.current.srcObject = e.streams[0];
        };

        pcRef.current.onicecandidate = (e) => {
            if (e.candidate) socket.emit('signal', { signal: e.candidate, partnerId });
        };

        if (partnerId) {
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            socket.emit('signal', { signal: offer, partnerId });
        }
    };

    const handleCall = () => {
        socket.emit('join-call');
    };

    const cancelSearch = () => {
        socket.emit('cancel-call'); // let server know we stopped searching
        setStatus('idle');
    };

    const endCall = () => {
        if (pcRef.current) pcRef.current.close();
        if (partnerRef.current) {
            socket.emit('end-call', { partnerId: partnerRef.current });
        }
        setStatus('idle');
        setTime(0);
        clearInterval(intervalRef.current);
    };

    const toggleMute = () => {
        if (localRef.current?.srcObject) {
            localRef.current.srcObject.getAudioTracks()[0].enabled = muted;
            setMuted(!muted);
        }
    };
    console.log("remoteRef", remoteRef)
    return (
        <div className="call-container">
            {status === 'idle' && <button onClick={handleCall}>Call</button>}

            {status === 'searching' && (
                <>
                    <p className="status">Searching partner...</p>
                    <button onClick={cancelSearch}>Cancel</button>
                </>
            )}

            {status === "inCall" && (
                <>
                    <p className="time-counter">Call time: {time}s</p>
                    <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>
                    <button onClick={endCall}>End Call</button>
                    <audio ref={localRef} autoPlay muted />
                    <audio ref={remoteRef} autoPlay />
                </>
            )}
        </div>
    );
}
