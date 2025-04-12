import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminAuthToken');
        navigate('/admin/login');
    };

    return (
        <div className="sidebar">
            <i style={{ fontSize: "24px" }} className='fas'>&#xf406;</i>
            <h4 style={{ marginLeft: "55px", marginTop: "-30px" }}>Admin</h4>
            <hr></hr>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/admin/users">Users</Link></li>
                <li><Link to="/admin/order">Orders</Link></li>
                <li><Link to="/admin/product">Product</Link></li>
                <li><Button variant="secondary" onClick={handleLogout}>Logout</Button></li>
            </ul>
        </div>
    );
};

export default Sidebar;
