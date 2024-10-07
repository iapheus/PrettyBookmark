import React from 'react';

function InfoCard({ title, description, icon }) {
  return (
    <div className='relative bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg hover:transition-transform'>
      <div className='p-6 flex flex-col items-center text-center'>
        <div className='text-4xl text-blue-500 dark:text-blue-400 mb-4'>
          {icon}
        </div>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
          {title}
        </h2>
        <p className='mt-2 text-gray-600 dark:text-gray-300'>
          {description}
        </p>
      </div>
    </div>
  );
}

export default InfoCard;
