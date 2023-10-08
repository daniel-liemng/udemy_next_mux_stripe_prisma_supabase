import Image from 'next/image';
import React from 'react';

const Logo = () => {
  return (
    <div className='flex gap-2 items-center'>
      <Image
        src='/logo.svg'
        alt='logo'
        width={130}
        height={130}
        className='w-16 h-8 object-contain'
        priority
      />
      <h2 className='text-xl text-sky-600 font-semibold'>Udemy</h2>
    </div>
  );
};

export default Logo;
