import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

export default function Header() {
    const { user } = useUser();
    const { signOut } = useClerk();

    return (
        <header className="header">
            <div className="header-left">
                {user?.imageUrl && (
                    <img src={user.imageUrl} alt="profile" className="profile-pic" />
                )}
                <div className="user-info">
                    <h2 className="user-name">{user?.fullName || "Anonymous"}</h2>
                    <p className="user-email">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
            </div>
            <div className="header-right">
                <button className="logout-btn" onClick={() => signOut({ redirectUrl: "/" })}>
                    Logout
                </button>
            </div>
        </header>
    );
}
