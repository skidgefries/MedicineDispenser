// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Medicines from './medicines';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route exact path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
