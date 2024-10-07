import React, { useState } from 'react';
import { MdBookmarks, MdAddBox, MdMenu } from "react-icons/md";
import { RiUserSharedFill } from "react-icons/ri";
import { CgImport } from "react-icons/cg";
import Collections from './Collections';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfilePart from './ProfilePart';

function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    let location = useLocation();
    let navigate = useNavigate();

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button onClick={toggleSidebar} className="lg:hidden fixed top-4 left-4 z-20">
                <MdMenu size={24} />
            </button>
            <div className={`fixed lg:relative bg-[#E1EAEE] dark:bg-[#111827] h-full w-full sm:w-64 lg:w-1/6 p-4 transition-all duration-300 ease-in-out ${isOpen ? 'left-0' : '-left-full'} lg:left-0 z-10 overflow-y-auto lg:overflow-y-visible`}>
                <img src='/triangle.svg' onClick={() => {navigate('/'); setIsOpen(false)}} className='h-10 ml-10 lg:ml-0' />
                <div className='mt-10'>
                    <button onClick={() => {navigate('/home/all'); setIsOpen(false)}} className={`${location.pathname === '/home/all' ? 'hover:border-gray-400 dark:hover:border-gray-400 dark:border-gray-600 border-black' : 'border-transparent'} border-2 text-black dark:text-white py-2 w-full mt-2 flex rounded`}>
                        <MdBookmarks size={18} className='my-auto mx-3 float-right'/> All bookmarks</button>
                    <button onClick={() => {navigate('/home/published'); setIsOpen(false)}} className={`${location.pathname === '/home/published' ? ' hover:border-gray-400 dark:hover:border-gray-400 dark:border-gray-600 border-black' : 'border-transparent'} border-2 text-black dark:text-white py-2 w-full mt-2 flex rounded`}>
                        <RiUserSharedFill size={18} className='my-auto mx-3 float-right'/> Published collections
                    </button>
                </div>
                <div className='mt-4'>
                    <p className='text-black dark:text-white text-lg font-mono mx-3'>My Collections</p>
                    <div className='mt-5'>
                        <Collections />
                    </div>
                    <div className=''>
                        <hr className='my-5 border-2 border-t border-gray-300 dark:border-gray-700'/>
                        <button onClick={() => {navigate('/home/collection/new'); setIsOpen(false)}} className={`border-2 text-black dark:text-white py-2 w-full mt-2 flex rounded
                            ${location.pathname === '/home/collection/new' ? 'hover:border-gray-400 dark:hover:border-gray-400 dark:border-gray-600 border-black' : 'border-transparent'}`}>
                            <MdAddBox size={18} className='my-auto mx-3 float-right'/> New Bookmark
                        </button>
                        <button onClick={() => {navigate('/home/collection/import'); setIsOpen(false)}} className={`border-2 text-black dark:text-white py-2 w-full mt-2 flex rounded
                            ${location.pathname === '/home/collection/import' ? 'hover:border-gray-400 dark:hover:border-gray-400 dark:border-gray-600 border-black' : 'border-transparent'}`}>
                            <CgImport size={18} className='my-auto mx-3 float-right'/> Import Bookmark
                        </button>
                    </div>
                    <div className='flex my-6'>
                        <ProfilePart />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SideBar;