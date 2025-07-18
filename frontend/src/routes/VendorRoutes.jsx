import React from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout/AdminLayout";

import Dashboard from "../pages/vendor/dashboard/Dashboard";
import Allusers from "../pages/vendor/users/Allusers";
import Adduser from "../pages/vendor/users/Adduser";
import BlockedUser from "../pages/vendor/users/BlockedUser";
import FeedbackandReview from "../pages/vendor/users/FeedbackandReview";
import ViewGallery from "../pages/vendor/gallery/ViewGallery";
import UploadGallery from "../pages/vendor/gallery/UploadGallery";

import Allvendors from "../pages/admin/vendor/Allvendors";


// for vendor routing

const AdminRoutes = (
  <Route path="/vendor" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users/allusers" element={<Allusers />} />
    <Route path="users/adduser" element={<Adduser />} />
    <Route path="users/blocked" element={<BlockedUser />} />
    <Route path="users/feedback" element={<FeedbackandReview />} />
    <Route path="gallery" element={<ViewGallery/>}/>
    <Route path="gallery/upload" element={<UploadGallery/>}/>
    
    {/* <Route path="clients" element={<Clients />} /> */}
  </Route>
);

export default AdminRoutes;
