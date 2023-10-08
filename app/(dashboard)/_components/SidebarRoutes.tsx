'use client';

import { Layout, Compass } from 'lucide-react';
import SidebarItem from './SidebarItem';

const guestRoutes = [
  { icon: Layout, label: 'Dashboard', href: '/' },
  { icon: Compass, label: 'Browse', href: '/search' },
];

const SidebarRoutes = () => {
  const routes = guestRoutes;
  return (
    <div className='w-full flex flex-col'>
      {routes.map((route) => (
        <SidebarItem
          icon={route.icon}
          label={route.label}
          href={route.href}
          key={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
