import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function RegisterModal({ isOpen, onClose }) {
  const [userMail, setUserMail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && isOpen) {
      navigate('/mobile/register');
    }
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  const userRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createUserWithEmailAndPassword(auth, userMail, userPassword);
      setSuccess('Registration successful!');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return ReactDOM.createPortal(
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
        >
          <FaTimes size={20} />
        </button>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Register
        </h2>
        <form onSubmit={userRegister}>
          <div className='mb-4'>
            <label className='block text-gray-700 dark:text-gray-300 mb-1'>Email</label>
            <input
              type='email'
              className='w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg'
              placeholder='Enter your email'
              value={userMail}
              onChange={(e) => setUserMail(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 dark:text-gray-300 mb-1'>Password</label>
            <input
              type='password'
              className='w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg'
              placeholder='Enter your password'
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          {error && <p className='text-red-500 mb-4'>{error}</p>}
          {success && <p className='text-green-500 mb-4'>{success}</p>}
          <button
            type='submit'
            className='w-full py-2 text-black dark:text-white border-2 border-black hover:bg-[#DAE5EB] dark:hover:bg-transparent dark:border-gray-600 rounded-2xl hover:border-gray-400 hover:dark:border-gray-400'
          >
            Register
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default RegisterModal;
