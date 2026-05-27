import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import TopAppBar from './TopAppBar';

const DashboardLayout: React.FC = () => (
  <div className="relative min-h-screen bg-[#f9f9f9]">
    <SideNavBar />
    <TopAppBar />
    <div className="pl-[256px] pt-[64px]">
      <Outlet />
    </div>
  </div>
);

export default DashboardLayout;
