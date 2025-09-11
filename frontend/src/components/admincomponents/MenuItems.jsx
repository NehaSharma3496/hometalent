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
        {
          icon: "fa-solid fa-users",
          label: "All Vendors",
          link: "/admin/vendor/allvendors",
        },
        {
          icon: "fa-solid fa-user-plus",
          label: "Add Vendor",
          link: "/admin/vendor/addvendors",
        },
        {
          icon: "fa-solid fa-user-check",
          label: "Active Vendor",
          link: "/admin/vendor/activevendors",
        },
        {
          icon: "fa-solid fa-user-shield",
          label: "Approve Vendors",
          link: "/admin/vendor/approvevendors",
        },
        {
          icon: "fa-solid fa-star",
          label: "Sponsored Vendors",
          link: "/admin/vendor/sponsoredvendors",
        },
        {
          icon: "fa-solid fa-user-slash",
          label: "Inactive Vendors",
          link: "/admin/vendor/blockedvendors",
        },
        {
          icon: "fa-solid fa-hourglass-half",
          label: "Pending Vendors",
          link: "/admin/vendor/pendingvendors",
        },
        {
          icon: "fa-solid fa-user-xmark",
          label: "Rejected Vendors",
          link: "/admin/vendor/rejectedvendors",
        },
      ],
    },
    {
      icon: "fa-solid fa-user",
      label: "Profile Management",
      link: "/admin/profileupdaterequest",
      children: [
        {
          icon: "fa-solid fa-id-card",
          label: "Profile Update Requests",
          link: "/admin/profileupdaterequest",
        },
        {
          icon: "fa-solid fa-images",
          label: "Admin Gallery",
          link: "/admin/adminGallery",
        },
      ],
    },
    {
      icon: "fa-solid fa-credit-card",
      label: "Payments",
      link: "/admin/payments/packages",
      children: [
        {
          icon: "fa-solid fa-box",
          label: "Subscription Packages",
          link: "/admin/payments/packages",
        },
        { icon: "fa-solid fa-plus", label: "Add packages", link: "addpackage" },
      ],
    },
    {
      icon: "fa-solid fa-envelope",
      label: "Enquiries & Leads",
      link: "/admin/enquiries/allleads",
      children: [
        {
          icon: "fa-solid fa-list",
          label: "All Leads",
          link: "/admin/enquiries/allleads",
        },
        {
          icon: "fa-solid fa-envelope-open-text",
          label: "All Enquiries",
          link: "/admin/enquiries/AllEnquiries",
        },
        {
          icon: "fa-solid fa-comment-dots",
          label: "All Feedback",
          link: "/admin/enquiries/allfeedback",
        },
      ],
    },
    {
      icon: "fa-solid fa-pen-to-square",
      label: "Blog",
      link: "/admin/blog/addblog",
      children: [
        {
          icon: "fa-solid fa-plus",
          label: "Add Blog",
          link: "/admin/blog/addblog",
        },
        {
          icon: "fa-solid fa-newspaper",
          label: "All Blogs",
          link: "/admin/blog/allblogs",
        },
      ],
    },
    {
      icon: "fa-solid fa-star",
      label: "Review/Report",
      link: "/admin/review/allreview",
      children: [
        {
          icon: "fa-solid fa-star-half-stroke",
          label: "All Review",
          link: "/admin/review/allreview",
        },
         {
          icon: "fa-solid fa-star-half-stroke",
          label: "All Report",
          link: "/admin/review/allreport",
        },
      ],
    },
  ],
  2: [
    {
      icon: "fa-solid fa-grid-2",
      label: "Dashboard",
      link: "/vendor/dashboard",
    },
    {
      icon: "fa fa-edit",
      label: "Update Profile",
      link: "/vendor/updateprofile",
      children: [
        {
          icon: "fa-solid fa-pen",
          label: "Update",
          link: "/vendor/updateprofile",
        },
      ],
    },
    {
      icon: "fa-solid fa-image",
      label: "Gallery",
      link: "/vendor/gallery",
      children: [
        {
          icon: "fa-solid fa-photo-film",
          label: "My Gallery",
          link: "/vendor/gallery",
        },
      ],
    },
    {
      icon: "fa-solid fa-chart-line",
      label: "Leads & Enquiries",
      link: "/vendor/leads/all",
      children: [
        {
          icon: "fa-solid fa-address-card",
          label: "All Leads",
          link: "/vendor/leads/all",
        },
      ],
    },
    {
      icon: "fa-solid fa-upload",
      label: "Packages",
      link: "/vendor/allpackages",
      children: [
        {
          icon: "fa-solid fa-box-open",
          label: "Available Packages",
          link: "/vendor/allpackages",
        },
        {
          icon: "fa-solid fa-receipt",
          label: "My Subscription",
          link: "/vendor/mypackages",
        },
      ],
    },
  ],
};

export default MenuItems;
