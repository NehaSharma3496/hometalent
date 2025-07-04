import React from 'react';

import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/admincomponents/AdminHeader';

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
       <main id="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
