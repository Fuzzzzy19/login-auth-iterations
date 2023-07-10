import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, useNavigate, Routes } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token');
  const navigate = useNavigate();

  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : navigate('/login')}
    />
  );
};

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to the Home page!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('<your-login-endpoint>', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setUsername('');
      setPassword('');
      setError('');
      navigate('/');
    } catch (error) {
      setError('Invalid username or password');
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute component={Home} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
