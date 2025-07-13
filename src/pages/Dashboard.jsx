import { Link, Routes, Route, Outlet } from 'react-router-dom';
import Profile from './Profile';
import Inquiry from './Inquiry';
import PurchaseOrder from './PurchaseOrder';
import '../Dashboard.css';
import toast from 'react-hot-toast';

function Dashboard() {
  return (
    <div className="dashboard">
      <nav className="sidebar">
        <Link to="/dashboard/profile">Profile</Link>
        <Link to="/dashboard/inquiry">Inquiry</Link>
        <Link to="/dashboard/purchase-order">Purchase Order</Link>
        <Link to="/signin" onClick={()=>{toast.success("Logout successfully")}}>Logout</Link>
      </nav>
      <div className="main">
        <Outlet /> 
      </div>
    </div>
  );
}

export default Dashboard;