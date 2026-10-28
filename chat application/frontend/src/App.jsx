import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);

    if (user) {
        return (
            <Chat
                user={user}
                setUser={setUser}
            />
        );
    }

    if (page === 'register') {
        return (
            <Register
                setPage={setPage}
            />
        );
    }

    return (
        <Login
            setUser={setUser}
            setPage={setPage}
        />
    );
}

export default App;