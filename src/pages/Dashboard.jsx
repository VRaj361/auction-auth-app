import { Link, Outlet } from 'react-router-dom';
import SupportWidget from './SupportWidget'; 
import '../Dashboard.css';
import toast from 'react-hot-toast';

function Dashboard() {
  return (
    <div className="dashboard">
      <nav className="sidebar">
        <Link to="/dashboard/profile">Profile</Link>
        <Link to="/dashboard/vendorDetails">Vendor Profile</Link>
        <Link to="/dashboard/inquiry">Inquiry</Link>
        <Link to="/dashboard/inquiry-status">Inquiry Status</Link>
        <Link to="/dashboard/purchase-order">Purchase Order</Link>
        <Link to="/signin" onClick={()=>{toast.success("Logout successfully")}}>Logout</Link>
      </nav>
      <div className="main">
        <Outlet /> 
      </div>
      <SupportWidget />
    </div>
  );
}

export default Dashboard;