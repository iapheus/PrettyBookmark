import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SideBar from '../Components/SideBar';
import HomeMain from '../Components/HomeMain';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                sessionStorage.setItem('uid', user.uid);
            } else {
                setUser(null);
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className='bg-[#E1EAEE] dark:bg-[#111827] h-screen w-screen flex'>
            <SideBar />
            <HomeMain />
        </div>
    );
}

export default Home;
