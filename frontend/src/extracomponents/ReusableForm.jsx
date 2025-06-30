import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const renderField = (field) => {
  switch (field.type) {
    case 'textarea':
      return (
        
        <Field
          as="textarea"
          name={field.name}
          placeholder={field.placeholder}
          className="form-input form-control"
        />
      );

    case 'select':
      return (
        <Field as="select" name={field.name} className="form-input form-control">
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      );

    case 'radio':
      return field.options?.map((option) => (
        <div key={option.value} className="form-check form-check-inline">
          <Field
            type="radio"
            name={field.name}
            value={option.value}
            className="form-check-input"
            id={`${field.name}-${option.value}`}
          />
          <label className="form-check-label" htmlFor={`${field.name}-${option.value}`}>
            {option.label}
          </label>
        </div>
      ));

    case 'checkbox':
      return (
        <div className="form-check">
          <Field type="checkbox" name={field.name} className="form-check-input" id={field.name} />
          <label className="form-check-label" htmlFor={field.name}>
            {field.label}
          </label>
        </div>
      );
case 'email':
      return (
      
          <Field type="emai" name={field.name} className="form-input form-control" id={field.name} />
         
        
      );
    default:
      return (
        <>
       
        <Field
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          className="form-input form-control"
        />
        </>
      );
  }
};

const ReusableForm = ({ initialValues, validationSchema, onSubmit, fields }) => {
  return (
    <Formik  initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {() => (
        <Form className="row main-form">
          {fields.map((field) => (
            <div key={field.name} className={field.colClass || 'col-12 mb-3'}>
                <div className='form-group'>
              {/* {field.type !== 'checkbox' && field.type !== 'radio' && ( */}
                <label htmlFor={field.name} className="input-label fw-semibold">
                  {field.label}
                </label>
                
              {/* )} */}
              {renderField(field)}
              <ErrorMessage name={field.name} component="div" className="text-danger small" />
            </div>
            </div>
          ))}

          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-2">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;
