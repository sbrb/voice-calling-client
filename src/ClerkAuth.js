import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';

const clerkPubKey = "pk_test_b3V0Z29pbmctYnVmZmFsby00MC5jbGVyay5hY2NvdW50cy5kZXYk";

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
