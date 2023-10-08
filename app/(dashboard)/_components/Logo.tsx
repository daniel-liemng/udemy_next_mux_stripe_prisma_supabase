import Image from 'next/image';
import React from 'react';

const Logo = () => {
  return (
    <Image
      src='/logo.svg'
      alt='logo'
      width={130}
      height={130}
      className='w-16 h-8 object-contain'
      priority
    />
  );
};

export default Logo;
