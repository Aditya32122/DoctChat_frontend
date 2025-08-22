// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Landing } from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ChatPage from './components/ChatPage';

function App() {
  

    return (
        <div>
         <Router>
        {/* <Navbar title="Smart Search" /> */}
        <div>
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chatpage" element={<ChatPage />} />
          </Routes>
        </div>
      </Router>
        </div>
    );
}

export default App;
