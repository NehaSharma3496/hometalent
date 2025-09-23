import React from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout/AdminLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Allvendors from "../pages/admin/vendor/Allvendors";
import BlockedVendors from "../pages/admin/vendor/BlockedVendors";
import SponsoredVendors from "../pages/admin/vendor/SponsoredVendors";
import Packages from "../pages/admin/packages/Packages";
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
import AddPackage from "../pages/admin/packages/AddPackage";
import UpdatePackages from "../pages/admin/packages/updatePackages";
import AllEnquiries from "../pages/admin/enquiries&leads/AllEnquiries";
import UploadGallery from "../pages/admin/adminGallery/UploadGallery";
import UpdateVendor from "../pages/admin/vendor/UpdateVendor";
import VendorPackageDetails from "../pages/admin/vendor/VendorPackageDetails";
import SponsoredRankUpdate from "../pages/admin/vendor/SponsoredRankUpdate";
import ViewProfileChanges from "../pages/admin/profileupdaterequest/ViewProfileChanges";
import RejectedVendors from "../pages/admin/vendor/RejectedVendors";
import AddBlog from "../pages/admin/blog/AddBlog";
import AllBlog from "../pages/admin/blog/AllBlog";
import UpdateBlog from "../pages/admin/blog/UpdateBlog";
import ChangePassword from "../pages/admin/forgotpassword/ChangePasword";
import ExtendPackageHistory from "../pages/admin/vendor/ExtendPackageHistory";
import AllReview from "../pages/admin/review/AllReview";
import AllFeedBack from "../pages/admin/enquiries&leads/AllFeedback";
import AllReport from "../pages/admin/review/AllReport";
import VendorAllLeads from "../pages/admin/vendor/VendorLeads";
import SubscribedVendors from "../pages/admin/vendor/SubscribedVendors";
import ExpiredVendors from "../pages/admin/vendor/ExpiredVendors";
import UnsubscribedVendors from "../pages/admin/vendor/UnsubscribedVendors";
import EmployeeList from "../pages/admin/employee/EmployeeList";
import AddEmployee from "../pages/admin/employee/AddEmployee";
import UpdateEmployee from "../pages/admin/employee/UpdateEmployee";

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
    <Route path="vendordetails" element={<VendorDetails />} />
    <Route path="vendor/pendingvendors" element={<PendingVendor />} />
    <Route path="vendor/activevendors" element={<ActiveVendor />} />
    <Route path="vendor/addvendors" element={<AddVendor />} />
    <Route path="adminGallery" element={<AdminGallery />} />
    <Route path="uploadgallery" element={<UploadGallery />} />
    <Route
      path="galleryUpdates/vendorgallery/:vendorId"
      element={<VendorGallery />}
    />
    <Route path="enquiries/allleads" element={<AllLeads />} />
    <Route path="Packages" element={<Packages />} />
    <Route path="addpackage" element={<AddPackage />} />
    <Route path="updatePackages/:packageId" element={<UpdatePackages />} />
    {/* <Route path="clients" element={<Clients />} /> */}
    <Route path="enquiries/AllEnquiries" element={<AllEnquiries />} />
    <Route path="vendor/updatevendor" element={<UpdateVendor />} />
    <Route
      path="vendor/vendorpackagedetails"
      element={<VendorPackageDetails />}
    />
    <Route
      path="vendor/sponsoredrankupdate"
      element={<SponsoredRankUpdate />}
    />
    <Route
      path="profileupdaterequest/viewprofilechanges"
      element={<ViewProfileChanges />}
    />
    <Route path="vendor/rejectedvendors" element={<RejectedVendors />} />
    <Route path="blog/addblog" element={<AddBlog />} />
    <Route path="blog/allblogs" element={<AllBlog />} />
    <Route path="updatepackage/:blogId" element={<UpdateBlog />} />
    <Route path="forgotpassword/changepassword" element={<ChangePassword />} />
    <Route path="extendpackagehistory" element={<ExtendPackageHistory />} />
    <Route path="review/allreview" element={<AllReview />} />
    <Route path="enquiries/allfeedback" element={<AllFeedBack />} />
    <Route path="review/allreport" element={<AllReport/>}/>
    <Route path="review/vendorallleads/:vendorId" element={<VendorAllLeads/>}/>
    <Route path="subscribedvendors" element={<SubscribedVendors/>}/>
    <Route path="expiredvendors" element={<ExpiredVendors/>}/>
    <Route path="unsubscribed" element={<UnsubscribedVendors/>}/>
    <Route path="employeelist" element={<EmployeeList/>}/>
    <Route path="addemployee" element={<AddEmployee/>}/>
    <Route path="updateemployee" element={<UpdateEmployee/>}/>
  </Route>
);

export default AdminRoutes;
