import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './Pages/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home'
import Login from './Pages/Login';
import ProtectedRoute from './user-routes/PrivateRoute';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Widget from './Pages/Widget';
import RegisterCharity from './Pages/RegisterCharity';
import AllCharities from './Pages/AllCharities';
import Donate from './Pages/Donate';

import Ongoing from './Pages/Ongoing';
import EditCharity from './Pages/EditCharity';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-campaign" element={<RegisterCharity />} />
        <Route path="/get-charities" element={<AllCharities />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/edit-campaign" element={<EditCharity />} />
        <Route path="/all-campaign" element={<AllCharities />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
       
        <Route path="/ongoing" element={<ProtectedRoute><Ongoing/></ProtectedRoute>} />
      </Routes>
      <ToastContainer/>
    </>
  );
}

export default App;