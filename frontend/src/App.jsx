import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

function App() {
    return (
        <Router>
            <AppProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </AppProvider>
        </Router>
    );
}

export default App;
