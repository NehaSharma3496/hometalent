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
import ApprovedVendors from "../pages/admin/vendor/ApprovedVendors";
import ProfileUpdateRequest from "../pages/admin/profileupdaterequest/ProfileUpdateRequest";
import VendorDetails from "../pages/admin/vendor/VendorDetails";
import PendingVendor from "../pages/admin/vendor/Pendingvendor";
import ActiveVendor from "../pages/admin/vendor/ActiveVendor";
import AddVendor from "../pages/admin/vendor/AddVendor";
import AdminGallery from "../pages/admin/adminGallery/AdminGallery";
import VendorGallery from "../pages/admin/galleryUpdateRequest/VendorGallery";
import AllLeads from "../pages/admin/enquiries&leads/AllLeads";
import AddPackage from "../pages/admin/review/AddPackage"
import UpdatePackages from "../pages/admin/review/updatePackages"


const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="vendor/allvendors" element={<Allvendors />} />
    <Route path="vendor/blockedvendors" element={<BlockedVendors />} />
    <Route path="vendor/sponsoredvendors" element={<SponsoredVendors />} />
    <Route path="payments/packages" element={<Packages />} />
    <Route path="users/adduser" element={<Adduser />} />
    <Route path="users/allusers" element={<Allusers />} />
    <Route path="users/blocked" element={<BlockedUser />} />
    <Route path="users/feedback" element={<FeedbackandReview />} />
    <Route path="vendor/approvevendors" element={<ApprovedVendors />} />
    <Route path="profileupdaterequest" element={<ProfileUpdateRequest />} />
    <Route path="vendor/:id" element={<VendorDetails />} />
    <Route path="vendor/pendingvendors" element={<PendingVendor />} />
    <Route path="vendor/activevendors" element={<ActiveVendor />} />
    <Route path="vendor/addvendors" element={<AddVendor />} />
    <Route path="adminGallery" element={<AdminGallery/>}/>
  <Route path="galleryUpdates/vendorgallery/:vendorId" element={<VendorGallery />} />
<Route path="enquiries/allleads" element={<AllLeads/>}/>
 <Route path="Packages" element={<Packages/>}/>
  <Route path="addpackage" element={<AddPackage/>}/>
    <Route path="updatePackages/:packageId" element={<UpdatePackages/>}/>
    {/* <Route path="clients" element={<Clients />} /> */}
  </Route>
);

export default AdminRoutes;
