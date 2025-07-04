import React from 'react'
import Breadcrumbs from '../components/websitecomponents/Breadcrumbs';

import ReusableForm from '../extracomponents/ReusableForm';
import * as Yup from 'yup';



const initialValues = {
  ownerName: '',
  profileName: '',
  state: '',
  city: '',
  pin: '',
  phone: '',
  email: '',
  priceRange: '',
  shortDesc: '',
  category: [],
  experience: '',
  longDesc: '',
  images: [],
  videos: [],
  socialLinks: '',
  terms: false,
  
};


const validationSchema = Yup.object({
  ownerName: Yup.string().required('Owner Name is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pin: Yup.string().required('Pin Code is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  category: Yup.array().min(1, 'Select at least one category'),
  terms: Yup.boolean().oneOf([true], 'You must accept terms'),
});

const onSubmit = (values) => {
  console.log('Form submitted:', values);
  // You can send to API or further process here
};

const fields = [
  { name: 'ownerName', label: 'Owner Name*', type: 'text', colClass: 'col-md-4 mb-3' },
  { name: 'profileName', label: 'Profile Name', type: 'text', colClass: 'col-md-4 mb-3' },
  { name: 'state', label: 'State', type: 'text', colClass: 'col-md-4 mb-3' },
  { name: 'city', label: 'City', type: 'text', colClass: 'col-md-4 mb-3' },
  { name: 'pin', label: 'Pin Code', type: 'text', colClass: 'col-md-4 mb-3' },
  { name: 'phone', label: 'Phone (Hidden in profile)', type: 'text', colClass: 'col-md-4 mb-3' },
  { name: 'email', label: 'Email', type: 'email', colClass: 'col-md-4 mb-3' },
  { name: 'priceRange', label: 'Estimated Price Range', type: 'text', colClass: 'col-md-4 mb-3' },
  
  {
    name: 'category',
    label: 'Category Select* (max 2)',
     type: 'multiSelect',
    colClass: 'col-md-4 mb-3',
    options: [
      { value: 'fashion', label: 'Fashion' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'grocery', label: 'Grocery' },
      { value: 'services', label: 'Services' },
      { value: 'others', label: 'Others' },
    ],
  },
  { name: 'shortDesc', label: 'One Line Description', type: 'text', colClass: 'col-md-12 mb-3' },
  { name: 'longDesc', label: 'Large Description', type: 'textarea', colClass: 'col-12 mb-3' },
  { name: 'images', label: 'Images (Max 30)', type: 'file', colClass: 'col-md-6 mb-3' },
  { name: 'videos', label: 'Videos (Max 3)', type: 'file', colClass: 'col-md-6 mb-3' },
  { name: 'socialLinks', label: 'Social Media Links', type: 'text', colClass: 'col-md-6 mb-3' },
    { name: 'experience', label: 'Experience Since', type: 'text', colClass: 'col-md-6 mb-3' },

  { name: 'terms', label: 'I accept Terms & Privacy Policy', type: 'checkbox', colClass: 'col-md-12 mb-3' },
];





const Registration = () => {

    const breadcrumbLinks = [
    { label: "Home", to: "/home" },
    { label: "Vendor Registration", to: "#" }, // or current route
  ];


  return (
   <div>
      <Breadcrumbs title="Vendor Registration" links={breadcrumbLinks} />
       <section className="login-area section-padding ">
    {/* <img src={logo} className=' mx-auto d-block' style={{width:'150px'}}/> */}


    <div className="container mt-4">
      
      <div className=" col-lg-12 mx-auto">
        <div className="login-card">
      <ReusableForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        fields={fields}
      />
    </div>
     </div>
  </div>
 </section>
</div>

  )
}

export default Registration