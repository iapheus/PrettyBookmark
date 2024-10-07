import React, { useEffect, useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import {auth} from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const[user,setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
      function listen(){
          onAuthStateChanged(auth, (user) => {
              if(user){
                  setUser(user)
              }else{
                  setUser(null)
              }
          })
      }
      listen();
  },[]);

  return (
    <div className='fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent dark:bg-gray-800'>
        <img src='/triangle.svg' className='h-10 mr-2 mt-1'></img>
      <div className='flex-grow'>
        <span className='text-xl text-black dark:text-gray-300 cursor-pointer'>
          pretty <span className='text-slate-500 dark:text-slate-500'>bookmark</span>
        </span>
      </div>
      <div className='flex-none flex items-center space-x-2 sm:space-x-4'>
        <DarkModeToggle />
        {
          user === null ?
          <div className='space-x-2'>
            <button 
              onClick={openLoginModal} 
              className='px-2 py-1 sm:px-4 sm:py-2 text-black dark:text-white border-2 border-black hover:bg-[#DAE5EB] dark:hover:bg-transparent dark:border-gray-600 rounded-2xl hover:border-gray-400 hover:dark:border-gray-400 text-xs sm:text-base'
            >
              Login
            </button>
            <button 
              onClick={openRegisterModal} 
              className='px-2 py-1 sm:px-4 sm:py-2 text-black dark:text-white border-2 border-black hover:bg-[#DAE5EB] dark:hover:bg-transparent dark:border-gray-600 rounded-2xl hover:border-gray-400 hover:dark:border-gray-400 text-xs sm:text-base'
            >
              Register
            </button>
          </div>
          :
          <div className='space-x-2'>
            <button 
              onClick={() => navigate('/home/all')} 
              className='px-2 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 text-black dark:text-white border-2 border-black dark:border-gray-600 rounded-2xl text-xs sm:text-base hover:bg-gradient-to-r hover:from-teal-300 hover:via-blue-400 hover:to-purple-500 hover:border-gray-400 hover:dark:border-gray-400 vibrateAnim'
            >
              Dashboard
            </button>
            <button 
              onClick={() => {signOut(auth); location.reload(); sessionStorage.removeItem('uid');}}
              className='px-2 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-black dark:text-white border-2 border-black dark:border-gray-600 rounded-2xl text-xs sm:text-base hover:bg-gradient-to-r hover:from-red-600 hover:via-red-500 hover:to-red-700 hover:border-gray-400 hover:dark:border-gray-400'
            >
              Exit
            </button>
          </div>
        }
      </div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[75%] hidden md:block'>
        <hr className='border-gray-300 dark:hidden' />
      </div>

      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default Navbar;
