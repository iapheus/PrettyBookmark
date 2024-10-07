import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';

function Register() {
  const [userMail, setUserMail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userRegister = (e) => {
    e.preventDefault();
    setError(null);

    createUserWithEmailAndPassword(auth, userMail, userPassword)
      .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-center h-16 bg-transparent dark:bg-gray-800">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <IoArrowBackOutline size={24} />
        </button>
        <span className="text-xl text-black dark:text-gray-300">
          pretty <span className="text-slate-500 dark:text-slate-500">bookmark</span>
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Register</h2>
        <form onSubmit={userRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"
              placeholder="Enter your email"
              value={userMail}
              onChange={(e) => setUserMail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"
              placeholder="Enter your password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 text-black dark:text-white border-2 border-black hover:bg-[#DAE5EB] dark:hover:bg-transparent dark:border-gray-600 rounded-2xl hover:border-gray-400 hover:dark:border-gray-400"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Already have an account?
        </p>
        <Link to="/mobile/login">
          <button className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Register;
