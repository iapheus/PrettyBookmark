import React from 'react';

const WavyBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <svg
        className="absolute top-0 left-0 h-full -ml-4 w-1/2"
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        style={{ transform: 'rotate(-90deg)', opacity: 0.8 }}
      >
        <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" className="fill-current text-[#DAE5EB] dark:text-gray-800" />
      </svg>
      <svg
        className="absolute top-0 right-0 h-full -mr-4 w-1/2"
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        style={{ transform: 'rotate(90deg)', opacity: 0.8 }}
      >
        <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" className="fill-current text-[#DAE5EB] dark:text-gray-800" />
      </svg>
    </div>
  );
};

export default WavyBackground;
