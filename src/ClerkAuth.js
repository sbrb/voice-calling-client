import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

export default function ClerkAuth({ children }) {
    return (
        <ClerkProvider publishableKey={clerkPubKey}>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <SignIn />
            </SignedOut>
        </ClerkProvider>
    );
}
