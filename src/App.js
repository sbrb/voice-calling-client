import React from 'react';
import Home from './Home';
import ClerkAuth from './ClerkAuth';

function App() {
    return (
        <ClerkAuth>
            <Home />
        </ClerkAuth>
    );
}

export default App;
