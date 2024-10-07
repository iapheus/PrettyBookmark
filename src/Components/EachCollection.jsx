import React from 'react'
import { FcPicture } from "react-icons/fc";
import { useLocation, useNavigate } from 'react-router-dom';

function Collections({collection}) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div onClick={() => {navigate(`/home/collection/${collection.id}`)}} 
    className={`flex items-center cursor-pointer border-2 rounded p-2 w-full ${location.pathname === `/home/collection/${collection.id}` ? 'border-black hover:border-gray-400 dark:hover:border-gray-400 dark:border-gray-600' : 'border-transparent'} `}>
        <FcPicture size={42}/>
        <p className='ml-2 text-black dark:text-white'>{collection.name}</p>
        <span className='ml-auto bg-slate-500 w-7 h-7 flex items-center rounded-lg justify-center text-white'>
            {collection.bookmarks.length}
        </span>
    </div>
  )
}

export default Collections
