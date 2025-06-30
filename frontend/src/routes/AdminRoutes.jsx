import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../layouts/adminlayout/AdminLayout';

import Dashboard from '../pages/admin/dashboard/Dashboard';
import Allusers from '../pages/admin/users/Allusers';
import Adduser from '../pages/admin/users/Adduser';


const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users/allusers" element={<Allusers />} />
    <Route path="users/adduser" element={<Adduser />} />
    {/* <Route path="clients" element={<Clients />} /> */}
  </Route>
);

export default AdminRoutes;
