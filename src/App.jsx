// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Inquiry from './pages/Inquiry';
import InquiryDetails from './pages/InquiryDetails';
import PurchaseOrder from './pages/PurchaseOrder';
import './App.css';
import {Toaster} from 'react-hot-toast'

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/signin" />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute user={user}>
                <Dashboard />
              </PrivateRoute>
            }
          >
              <Route path="profile" element={<Profile user={user}/>} />
              <Route path="inquiry" element={<Inquiry />} />
              <Route path="inquiry/:id" element={<InquiryDetails />} />
              <Route path="purchase-order" element={<PurchaseOrder />} />
          </Route>
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;