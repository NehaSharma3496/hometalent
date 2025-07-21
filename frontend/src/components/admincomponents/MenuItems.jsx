// src/config/menuConfig.js

export const MenuItems = {
  1: [
    {
      icon: "fa-solid fa-grid-2",
      label: "Dashboard",
      link: "/admin/dashboard",
    },
    // {
    //   icon: "fa-solid fa-user",
    //   label: "Users",
    //   children: [
    //     { label: "All Users", link: "/admin/users/allusers" },
    //     { label: "Add User", link: "/admin/users/adduser" },
    //     { label: "Blocked Users", link: "/admin/users/blocked" },
    //     { label: "Feedback & Reviews", link: "/admin/users/feedback" },
    //   ],
    // },
    {
      icon: "fa-solid fa-user-tie",
      label: "Vendors",
      children: [
        { label: "All Vendors", link: "/admin/vendor/allvendors" },
        { label: "Add Vendor", link: "/admin/vendor/addvendors" },
        { label: "Active Vendor", link: "/admin/vendor/activevendors" },
        { label: "Approve Vendores", link: "/admin/vendor/approvevendors" },
        { label: "Sponsored Vendors", link: "/admin/vendor/sponsoredvendors" },
        { label: "Blocked Vendors", link: "/admin/vendor/blockedvendors" },
        { label: "Pending Vendors", link: "/admin/vendor/pendingvendors" },
        { label: "Shuffle Vendor Order", link: "/admin/vendor/shuffle-order" },
        { label: "Leads & Inquiries", link: "/admin/vendor/leads" },
      ],
    },
    {
      icon: "fa-solid fa-user-tie",
      label: "Profile Management",
      children: [
        {
          label: "Profile Update Requests",
          link: "/admin/profileupdaterequest",
        },
        { label: "Admin Galary", link: "/admin/adminGallery" },
        // { label: "Add Vendor", link: "/vendors/addvendors" },
        // { label: "Approve Vendores", link: "/admin/vendor/approvevendors" },
        // { label: "Sponsored Vendors", link: "/admin/vendor/sponsoredvendors" },
        // { label: "Blocked Vendors", link: "/admin/vendor/blockedvendors" },
        // { label: "Shuffle Vendor Order", link: "/admin/vendor/shuffle-order" },
        // { label: "Leads & Inquiries", link: "/admin/vendor/leads" },
      ],
    },
    {
      icon: "fa-solid fa-box",
      label: "Listings",
      children: [
        { label: "All Listings", link: "/listings/all" },
        { label: "Pending Approval", link: "/listings/pending" },
        { label: "By City", link: "/listings/by-city" },
        { label: "By Category", link: "/listings/by-category" },
        { label: "Expired Listings", link: "/listings/expired" },
      ],
    },
    {
      icon: "fa-solid fa-pen-nib",
      label: "CMS (Content)",
      children: [
        { label: "All Articles", link: "/cms/wedding-vogue/articles" },
        { label: "Add Article", link: "/cms/wedding-vogue/add-article" },
        { label: "Manage Categories", link: "/cms/wedding-vogue/categories" },
        { label: "All Stories", link: "/cms/real-weddings/stories" },
        { label: "Add Story", link: "/cms/real-weddings/add" },
        { label: "Filters", link: "/cms/real-weddings/filters" },
        { label: "All Media", link: "/cms/gallery/all" },
        { label: "Upload Media", link: "/cms/gallery/upload" },
        { label: "By Theme / Vendor", link: "/cms/gallery/theme" },
      ],
    },
    {
      icon: "fa-solid fa-comments",
      label: "Reviews",
      children: [
        { label: "All Reviews", link: "/reviews/all" },
        { label: "Pending Approval", link: "/reviews/pending" },
        { label: "Reported Reviews", link: "/reviews/reported" },
      ],
    },
    {
      icon: "fa-solid fa-credit-card",
      label: "Payments",
      children: [
        { label: "Subscription Packages", link: "/admin/payments/packages" },
        { label: "Payment History", link: "/payments/history" },
        { label: "Renewals", link: "/payments/renewals" },
        { label: "Offers / Discounts", link: "/payments/offers" },
      ],
    },
    // {
    //   icon: 'fa-solid fa-bell',
    //   label: 'Notifications',
    //   children: [
    //     { label: 'All Notifications', link: '/notifications/all' },
    //     { label: 'User Alerts', link: '/notifications/user-alerts' },
    //     { label: 'Vendor Alerts', link: '/notifications/vendor-alerts' }
    //   ]
    // },
    {
      icon: "fa-solid fa-envelope",
      label: "Enquiries & Leads",
      children: [
        { label: "All Leads", link: "/admin/enquiries/allleads" },
        { label: "Vendor Leads", link: "/enquiries/vendor" },
        { label: "Conversion Reports", link: "/enquiries/reports" },
      ],
    },
    // {
    //   icon: 'fa-solid fa-gear',
    //   label: 'Settings',
    //   children: [
    //     { label: 'General Site Settings', link: '/settings/general' },
    //     { label: 'Privacy & Terms', link: '/settings/privacy' },
    //     { label: 'SEO & Meta Info', link: '/settings/seo' },
    //     { label: 'Contact Info', link: '/settings/contact' }
    //   ]
    // },
    {
      icon: "fa-solid fa-user-shield",
      label: "Admin Users",
      children: [
        { label: "Manage Admins", link: "/admin/manage" },
        { label: "Roles & Permissions", link: "/admin/roles" },
        { label: "Activity Logs", link: "/admin/logs" },
      ],
    },
    // {
    //   icon: 'fa-solid fa-right-from-bracket',
    //   label: 'Logout',
    //   link: '/logout'
    // }
  ],
  2: [
    {
      icon: "fa-solid fa-grid-2",
      label: "Dashboard",
      link: "/vendor/dashboard",
    },
    {
      icon: "fa-solid fa-user",
      label: "Users",
      children: [
        { label: "All Users", link: "/vendor/users/allusers" },
        { label: "Add User", link: "/vendor/users/adduser" },
        { label: "Blocked Users", link: "/vendor/users/blocked" },
        { label: "Feedback & Reviews", link: "/vendor/users/feedback" },
      ],
    },

    {
      icon: "fa-solid fa-image",
      label: "Gallery",
      children: [
        { label: "My Gallery", link: "/vendor/gallery" },
        { label: "Upload Media", link: "/vendor/gallery/upload" },
      ],
    },

    {
      icon: "fa-solid fa-list",
      label: "Listing",
      children: [
        { label: "All Listings", link: "/vendor/listings/all" },
        { label: "Add Listing", link: "/vendor/listings/add" },
        { label: "Manage Services", link: "/vendor/services/manage" },
        { label: "Service Reviews", link: "/vendor/services/reviews" },
      ],
    },
    {
      icon: "fa-solid fa-chart-line",
      label: "Leads & Inquiries",
      children: [
        { label: "All Leads", link: "/vendor/leads/all" },
        { label: "New Inquiries", link: "/vendor/inquiries/new" },
        { label: "Follow-ups", link: "/vendor/inquiries/followups" },
        { label: "Closed Inquiries", link: "/vendor/inquiries/closed" },
      ],
    },
    {
      icon: "fa-solid fa-upload",
      label: "Upload & Profiling",
      children: [
        { label: "Upload Portfolio", link: "/vendor/profile/upload" },
        { label: "Manage Portfolio", link: "/vendor/profile/manage" },
        { label: "Edit Profile", link: "/vendor/profile/edit" },
        { label: "Add Artwork / Painting", link: "/vendor/profile/artworks" },
      ],
    },
    {
      icon: "fa-solid fa-credit-card",
      label: "Profile Hosting",
      children: [
        { label: "View Charges", link: "/vendor/charges/view" },
        { label: "Payment History", link: "/vendor/charges/history" },
        { label: "Upgrade Plan", link: "/vendor/charges/upgrade" },
        { label: "Billing Settings", link: "/vendor/charges/settings" },
      ],
    },
    {
      icon: "fa-solid fa-briefcase",
      label: "Review & Portfolio",
      children: [
        { label: "Customer Reviews", link: "/vendor/reviews/customer" },
        { label: "Service Ratings", link: "/vendor/reviews/ratings" },
        { label: "My Portfolio", link: "/vendor/portfolio/view" },
        { label: "Update Portfolio", link: "/vendor/portfolio/update" },
      ],
    },
    {
      icon: "fa-solid fa-file-alt",
      label: "Informational Pages",
      children: [
        { label: "About Us", link: "/vendor/info/about" },
        { label: "Terms & Conditions", link: "/vendor/info/terms" },
        { label: "Privacy Policy", link: "/vendor/info/privacy" },
        { label: "Help / FAQs", link: "/vendor/info/help" },
      ],
    },
    {
      icon: "fa-solid fa-paper-plane",
      label: "Enquiries",
      children: [
        { label: "Sent to Admin", link: "/vendor/enquiries/admin" },
        {
          label: "Received from Customers",
          link: "/vendor/enquiries/received",
        },
        { label: "Responded Enquiries", link: "/vendor/enquiries/responded" },
      ],
    },
    {
      icon: "fa-solid fa-share-alt",
      label: "Social Sharing",
      children: [
        { label: "Share Profile", link: "/vendor/social/share-profile" },
        { label: "Share Services", link: "/vendor/social/share-services" },
        { label: "Connected Platforms", link: "/vendor/social/integrations" },
      ],
    },
    {
      icon: "fa-solid fa-envelope",
      label: "Customer Contact ",
      children: [
        { label: "Email Templates", link: "/vendor/contact/email-templates" },
        {
          label: "Contact Visibility Settings",
          link: "/vendor/contact/settings",
        },
        { label: "View Sent Mails", link: "/vendor/contact/sent-mails" },
      ],
    },
    {
      icon: "fa-solid fa-bell",
      label: "Notifications",
      children: [
        { label: "System Alerts", link: "/vendor/notifications/system" },
        { label: "Enquiry Updates", link: "/vendor/notifications/enquiries" },
        {
          label: "Payment & Plan Alerts",
          link: "/vendor/notifications/payments",
        },
        { label: "All Notifications", link: "/vendor/notifications/all" },
      ],
    },
  ],
};
export default MenuItems;
