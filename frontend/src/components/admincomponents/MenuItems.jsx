// src/config/menuConfig.js

export const  MenuItems = {

   1:[
  {
    icon: 'fa-solid fa-grid-2',
    label: 'Dashboard',
    link: '/admin/dashboard'
  },
  {
    icon: 'fa-solid fa-user',
    label: 'Users',
    children: [
      { label: 'All Users', link: '/admin/users/allusers' },
      { label: 'Add User', link: '/admin/users/adduser' },
      { label: 'Blocked Users', link: '/users/blocked' },
      { label: 'Feedback & Reviews', link: '/users/feedback' }
    ]
  },
  {
    icon: 'fa-solid fa-user-tie',
    label: 'Vendors',
    children: [
      { label: 'All Vendors', link: '/vendors/all' },
      { label: 'Add Vendor', link: '/vendors/add' },
      { label: 'Approve Listings', link: '/vendors/approve' },
      { label: 'Sponsored Vendors', link: '/vendors/sponsored' },
      { label: 'Blocked Vendors', link: '/vendors/blocked' },
      { label: 'Shuffle Vendor Order', link: '/vendors/shuffle-order' },
      { label: 'Leads & Inquiries', link: '/vendors/leads' }
    ]
  },
  {
    icon: 'fa-solid fa-box',
    label: 'Listings',
    children: [
      { label: 'All Listings', link: '/listings/all' },
      { label: 'Pending Approval', link: '/listings/pending' },
      { label: 'By City', link: '/listings/by-city' },
      { label: 'By Category', link: '/listings/by-category' },
      { label: 'Expired Listings', link: '/listings/expired' }
    ]
  },
  {
    icon: 'fa-solid fa-pen-nib',
    label: 'CMS (Content)',
    children: [
      { label: 'All Articles', link: '/cms/wedding-vogue/articles' },
      { label: 'Add Article', link: '/cms/wedding-vogue/add-article' },
      { label: 'Manage Categories', link: '/cms/wedding-vogue/categories' },
      { label: 'All Stories', link: '/cms/real-weddings/stories' },
      { label: 'Add Story', link: '/cms/real-weddings/add' },
      { label: 'Filters', link: '/cms/real-weddings/filters' },
      { label: 'All Media', link: '/cms/gallery/all' },
      { label: 'Upload Media', link: '/cms/gallery/upload' },
      { label: 'By Theme / Vendor', link: '/cms/gallery/theme' }
    ]
  },
  {
    icon: 'fa-solid fa-comments',
    label: 'Reviews',
    children: [
      { label: 'All Reviews', link: '/reviews/all' },
      { label: 'Pending Approval', link: '/reviews/pending' },
      { label: 'Reported Reviews', link: '/reviews/reported' }
    ]
  },
  {
    icon: 'fa-solid fa-credit-card',
    label: 'Payments',
    children: [
      { label: 'Subscription Packages', link: '/payments/packages' },
      { label: 'Payment History', link: '/payments/history' },
      { label: 'Renewals', link: '/payments/renewals' },
      { label: 'Offers / Discounts', link: '/payments/offers' }
    ]
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
    icon: 'fa-solid fa-envelope',
    label: 'Enquiries & Leads',
    children: [
      { label: 'User Enquiries', link: '/enquiries/user' },
      { label: 'Vendor Leads', link: '/enquiries/vendor' },
      { label: 'Conversion Reports', link: '/enquiries/reports' }
    ]
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
    icon: 'fa-solid fa-user-shield',
    label: 'Admin Users',
    children: [
      { label: 'Manage Admins', link: '/admin/manage' },
      { label: 'Roles & Permissions', link: '/admin/roles' },
      { label: 'Activity Logs', link: '/admin/logs' }
    ]
  },
  // {
  //   icon: 'fa-solid fa-right-from-bracket',
  //   label: 'Logout',
  //   link: '/logout'
  // }


],
2:[
  {
    icon: 'fa-solid fa-grid-2',
    label: 'Dashboard',
    link: '/vendor/dashboard'
  },
  {
    icon: 'fa-solid fa-user',
    label: 'Users',
    children: [
      { label: 'All Users', link: '/vendor/users/allusers' },
      { label: 'Add User', link: '/vendor/users/adduser' },
      { label: 'Blocked Users', link: '/users/blocked' },
      { label: 'Feedback & Reviews', link: '/users/feedback' }
    ]
  },
  
]
}
  export default MenuItems;
