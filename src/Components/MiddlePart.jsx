import React from 'react';
import InfoCard from './InfoCard';
import { FaSave, FaShareAlt, FaThList } from 'react-icons/fa';

function MiddlePart() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 dark:bg-gray-900 pt-5'>
      <div className='text-center mb-8 sm:mb-12 mt-14'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono text-gray-900 dark:text-gray-100 mb-4'>
          Save<span className='font-sans'>.</span> Share<span className='font-sans'>.</span> Organize<span className='font-sans'>.</span>
        </h1>
        <p className='text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300'>
          Seamlessly manage and access your bookmarks from anywhere.
        </p>
        <p className='text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300'>
          Share your favorite links with ease!
        </p>
      </div>
      <div className='flex flex-wrap justify-center space-y-5 gap-6 sm:gap-8 md:space-y-0'>
        <InfoCard
          title="Save Favorites"
          description="Store your favorite websites and resources securely for easy access."
          icon={<FaSave className='text-4xl sm:text-5xl md:text-6xl' />}
        />
        <InfoCard
          title="Share with Ease"
          description="Quickly share your bookmarks with friends and family."
          icon={<FaShareAlt className='text-4xl sm:text-5xl md:text-6xl' />}
        />
        <InfoCard
          title="Organize Smartly"
          description="Arrange your bookmarks into folders for efficient management."
          icon={<FaThList className='text-4xl sm:text-5xl md:text-6xl' />}
        />
      </div>
    </div>
  );
}

export default MiddlePart;
