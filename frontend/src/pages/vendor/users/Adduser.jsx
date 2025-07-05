import React from 'react';
import ReusableForm from '../../../extracomponents/ReusableForm';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const Adduser = () => {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name', colClass: 'col-md-6' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name', colClass: 'col-md-6' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'example@mail.com', colClass: 'col-md-6' },
    { name: 'gender', label: 'Gender', type: 'radio', colClass: 'col-md-6', options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ]},
    { name: 'country', label: 'Country', type: 'select', colClass: 'col-md-6', options: [
      { label: 'India', value: 'india' },
      { label: 'USA', value: 'usa' },
      { label: 'UK', value: 'uk' },
    ]},
    { name: 'about', label: 'About You', type: 'textarea', placeholder: 'Tell something...', colClass: 'col-md-6' },
    { name: 'terms', label: 'I agree to the terms & conditions', type: 'checkbox', colClass: 'col-12' },
  ];

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    country: '',
    about: '',
    terms: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    gender: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    about: Yup.string().min(10, 'Minimum 10 characters'),
    terms: Yup.boolean().oneOf([true], 'You must accept terms'),
  });

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
     <div className="page-content">
        
                <div className="add-page-heading-div mb-4">
                    <Link to="/"><i className="fa-sharp fa-regular fa-arrow-left"></i></Link>
                    <h2 className="add-page-heading">Add User</h2>
                </div>
    <div className="card">
     
      <ReusableForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        fields={fields}
      />
    </div>
    </div>
  );
};

export default Adduser;
