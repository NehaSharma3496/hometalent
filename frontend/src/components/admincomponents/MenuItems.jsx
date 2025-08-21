// src/config/menuConfig.js

export const MenuItems = {
  1: [
    {
      icon: "fa-solid fa-grid-2",
      label: "Dashboard",
      link: "/admin/dashboard",
    },
    {
      icon: "fa-solid fa-user-tie",
      label: "Vendors",
      link: "/admin/vendor/allvendors",
      children: [
        { label: "All Vendors", link: "/admin/vendor/allvendors" },
        { label: "Add Vendor", link: "/admin/vendor/addvendors" },
        { label: "Active Vendor", link: "/admin/vendor/activevendors" },
        { label: "Approve Vendors", link: "/admin/vendor/approvevendors" },
        { label: "Sponsored Vendors", link: "/admin/vendor/sponsoredvendors" },
        { label: "Inactive Vendors", link: "/admin/vendor/blockedvendors" },
        { label: "Pending Vendors", link: "/admin/vendor/pendingvendors" },
        { label: "Rejected Vendors", link: "/admin/vendor/rejectedvendors" },
      ],
    },
    {
      icon: "fa-solid fa-user",
      label: "Profile Management",
      link: "/admin/profileupdaterequest",
      children: [
        {
          label: "Profile Update Requests",
          link: "/admin/profileupdaterequest",
        },
        { label: "Admin Gallery", link: "/admin/adminGallery" },
      ],
    },
    {
      icon: "fa-solid fa-credit-card",
      label: "Payments",
      link: "/admin/payments/packages",
      children: [
        { label: "Subscription Packages", link: "/admin/payments/packages" },
        { label: "Add packages", link: "addpackage" },
      ],
    },
    {
      icon: "fa-solid fa-envelope",
      label: "Enquiries & Leads",
      link: "/admin/enquiries/allleads",
      children: [
        { label: "All Leads", link: "/admin/enquiries/allleads" },
        { label: "All Enquiries", link: "/admin/enquiries/AllEnquiries" },
      ],
    },
    {
      icon: "fa-solid fa-pen-to-square",
      label: "Blog",
      link: "/admin/blog/addblog",
      children: [
        { label: "Add Blog", link: "/admin/blog/addblog" },
        { label: "All Blogs", link: "/admin/blog/allblogs" },
      ],
    },
    {
      icon: "fa-solid fa-star",
      label: "Review",
      link: "/admin/review/allreview",
      children: [{ label: "All Review", link: "/admin/review/allreview" }],
    },
  ],
  2: [
    {
      icon: "fa-solid fa-grid-2",
      label: "Dashboard",
      link: "/vendor/dashboard",
    },
    {
      icon: "fa fa-edit ",
      label: "Update Profile",
      link: "/vendor/updateprofile",
      children: [{ label: "Update", link: "/vendor/updateprofile" }],
    },

    {
      icon: "fa-solid fa-image",
      label: "Gallery",
      link: "/vendor/gallery",
      children: [{ label: "My Gallery", link: "/vendor/gallery" }],
    },
    {
      icon: "fa-solid fa-chart-line",
      label: "Leads & Enquiries",
      link: "/vendor/leads/all",
      children: [{ label: "All Leads", link: "/vendor/leads/all" }],
    },
    {
      icon: "fa-solid fa-upload",
      label: "Packages",
      link: "/vendor/allpackages",
      children: [
        { label: "Available Packages", link: "/vendor/allpackages" },
        { label: "My Subscription", link: "/vendor/mypackages" },
      ],
    },
  ],
};
export default MenuItems;
