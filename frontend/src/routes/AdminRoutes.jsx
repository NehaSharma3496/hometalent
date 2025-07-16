import React from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout/AdminLayout";

import Dashboard from "../pages/admin/dashboard/Dashboard";
import Allvendors from "../pages/admin/vendor/Allvendors";
import BlockedVendors from "../pages/admin/vendor/BlockedVendors";
import SponsoredVendors from "../pages/admin/vendor/SponsoredVendors";
import Packages from "../pages/admin/review/Packages";
import Allusers from "../pages/vendor/users/Allusers";
import Adduser from "../pages/admin/vendor/Adduser";
import BlockedUser from "../pages/vendor/users/BlockedUser";
import FeedbackandReview from "../pages/vendor/users/FeedbackandReview";

const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="vendor/allvendors" element={<Allvendors />} />
    <Route path="vendor/blockedvendors" element={<BlockedVendors />} />
    <Route path="vendor/sponsoredvendors" element={<SponsoredVendors />} />
    <Route path="payments/packages" element={<Packages />} />
    <Route path="users/adduser" element={<Adduser />} />
    <Route path="users/allusers" element={<Allusers/>}/>
    <Route path="users/blocked" element={<BlockedUser/>}/>
    <Route path="users/feedback" element={<FeedbackandReview/>}/>
    {/* <Route path="clients" element={<Clients />} /> */}
  </Route>
);

export default AdminRoutes;
