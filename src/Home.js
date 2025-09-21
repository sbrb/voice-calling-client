import React from "react";
import Call from "./Call";
import Header from "./Header";

export default function Home() {
    return (
        <div>
            <div className="home" style={{ textAlign: "center", marginTop: "40px" }}>
                <h1>🎤 Speak English</h1>
                <Header />
                <Call />
            </div>
        </div>
    );
}
