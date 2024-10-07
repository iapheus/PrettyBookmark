import React from 'react';
import { Outlet } from 'react-router-dom';

function HomeMain() {
    return (
        <div className='bg-white dark:bg-[#1C2533] flex-1 rounded-xl m-3 p-4'>
            <Outlet />
        </div>
    );
}

export default HomeMain;
