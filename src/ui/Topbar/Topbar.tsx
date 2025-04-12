import React, { useEffect, useState } from 'react';

const TopBar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const today = new Date();
        setCurrentDate(today);
    }, []);

    return (
        <div className="top-bar">
            <h1>Welcome to the Admin Panel</h1>
            <div className="user-info">
                <h4 style={{ margin: 0 }}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
            </div>
        </div>
    );
};

export default TopBar;
