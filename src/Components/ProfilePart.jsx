import React from 'react'
import { ImExit } from "react-icons/im";
import DarkModeToggle from './DarkModeToggle';
import { useNavigate } from 'react-router-dom';
import {auth} from '../firebase'
import { signOut } from 'firebase/auth'

function ProfilePart() {
  const navigate = useNavigate();
  return (
    <div className='flex space-x-5'>
      <div className='flex space-x-2 cursor-default'>
        <img  className='h-12' src='/avatar.svg'></img>
        <p className='my-auto dark:text-white'>Profile</p>
      </div>

      <DarkModeToggle />
      <ImExit size={26} onClick={() => {signOut(auth); navigate('/'); sessionStorage.removeItem('uid');}}
         className='cursor-pointer mt-3 my-auto dark:text-white' />
    </div>
  )
}

export default ProfilePart