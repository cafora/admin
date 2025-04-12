import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../Topbar/Topbar';
import Footer from '../Footer/Footer';

const Layout: React.FC = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content"> <Outlet /> </div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;