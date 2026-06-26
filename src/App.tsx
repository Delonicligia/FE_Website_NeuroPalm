import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import Harga from './pages/harga/harga';
import Riwayat from './pages/riwayat/riwayat';
import Users from './pages/users/users';

function App() {
  return (
    // <div className="App">
    //   <Login />
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/harga" element={<Harga />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
