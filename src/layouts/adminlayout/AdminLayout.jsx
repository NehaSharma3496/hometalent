import React from 'react';
import '../../assets/adminAssets/css/style.css';
import '../../assets/adminAssets/css/responsive.css';

import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/admincomponents/AdminHeader';

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
