// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Inquiry from './pages/Inquiry';
import InquiryDetails from './pages/InquiryDetails';
import InquiryStatus from './pages/InquiryStatus';
import CompanyDetails from './pages/CompanyDetails'
import PurchaseOrder from './pages/PurchaseOrder';
import PurchaseOrderDetails from './pages/PurchaseOrderDetails';
import AmendmentRequest from './pages/AmendmentRequest';
import QueryPage from './pages/QueryPage';
import PaymentPage from './pages/PaymentPage';
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
              <Route path="vendorDetails" element={<CompanyDetails />} />
              <Route path="inquiry" element={<Inquiry />} />
              <Route path="inquiry/:id" element={<InquiryDetails />} />
              <Route path="inquiry-status" element={<InquiryStatus />} />
              <Route path="purchase-order" element={<PurchaseOrder />} />
              <Route path="purchase-order/:id" element={<PurchaseOrderDetails />} />
              <Route path="amendment/:id" element={<AmendmentRequest />} />
              <Route path="query/:id" element={<QueryPage />} />
              <Route path="payment/:id" element={<PaymentPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;