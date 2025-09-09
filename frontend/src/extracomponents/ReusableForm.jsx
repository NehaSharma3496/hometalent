import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikConsumer } from "formik";
import Select from "react-select";

const renderField = (field, form, values) => {
  // Handle custom components (like phone verification)
  if (field.type === "custom" && field.customComponent) {
    const CustomComponent = field.customComponent;
    return (
      <CustomComponent
        values={values}
        setFieldValue={form.setFieldValue}
        setFieldTouched={form.setFieldTouched}
        touched={form.touched}
        errors={form.errors}
        // Pass the entire form object for more flexibility
        form={form}
      />
    );
  }

  switch (field.type) {
    case "textarea":
      return (
        <Field
          as="textarea"
          name={field.name}
          placeholder={field.placeholder}
          className="form-control contact-input"
        />
      );

    case "select":
      return (
        <Field name={field.name}>
          {({ field: formikField, form }) => (
            <select
              {...formikField}
              className="form-control contact-input"
              onChange={(e) => {
                form.setFieldValue(field.name, e.target.value);
                if (field.onChange) field.onChange(e, form.setFieldValue);
              }}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      );

    case "multiSelect":
      return (
        <Field name={field.name}>
          {({ field: { value }, form }) => (
            <Select
              isMulti
              name={field.name}
              options={field.options}
              className="basic-multi-select"
              classNamePrefix="select"
              value={field.options.filter((option) =>
                value.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                form.setFieldValue(
                  field.name,
                  selectedOptions.map((option) => option.value)
                )
              }
              onBlur={() => form.setFieldTouched(field.name, true)}
            />
          )}
        </Field>
      );

    case "radio":
      return field.options?.map((option) => (
        <div key={option.value} className="form-check form-check-inline">
          <Field
            type="radio"
            name={field.name}
            value={option.value}
            className="form-check-input"
            id={`${field.name}-${option.value}`}
          />
          <label
            className="form-check-label"
            htmlFor={`${field.name}-${option.value}`}
          >
            {option.label}
          </label>
        </div>
      ));

    case "checkbox":
      return (
        <div className="form-check">
          <Field
            type="checkbox"
            name={field.name}
            className="form-check-input"
            id={field.name}
          />
          <label className="form-check-label" htmlFor={field.name}>
            {field.label}
          </label>
        </div>
      );

    case "email":
      return (
        <Field
          type="email"
          name={field.name}
          className="form-control contact-input"
          id={field.name}
          placeholder={field.placeholder}
        />
      );

    case "password":
      return (
        <Field
          type="password"
          name={field.name}
          placeholder={field.placeholder}
          className="form-control contact-input"
          id={field.name}
          autoComplete={field.autoComplete}
        />
      );

    case "file":
      return (
        <Field name={field.name}>
          {({ form }) => (
            <input
              type="file"
              name={field.name}
              className="form-control contact-input"
              accept={field.accept}
              multiple={field.multiple !== false}
              onChange={(event) => {
                const files = event.currentTarget.files;
                form.setFieldValue(
                  field.name,
                  field.multiple !== false ? files : files[0]
                );
              }}
            />
          )}
        </Field>
      );

    default:
      return (
        <Field name={field.name}>
          {({ field: formikField, form }) => (
            <input
              {...formikField}
              type={field.type}
              placeholder={field.placeholder}
              className="form-control contact-input"
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              // Handle onChange for special cases
              onChange={(e) => {
                let value = e.target.value;

                // Special handling for numeric fields
                if (field.numeric) {
                  value = value.replace(/[^0-9]/g, "");
                  if (field.maxLength) {
                    value = value.slice(0, field.maxLength);
                  }
                }

                form.setFieldValue(field.name, value);

                // Call custom onChange if provided
                if (field.onChange) {
                  field.onChange(e, form.setFieldValue);
                }
              }}
            />
          )}
        </Field>
      );
  }
};

const ReusableForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  SubmitBtn,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      // Enable reinitialize to handle dynamic initial values
      enableReinitialize={true}
    >
      {({ handleSubmit, validateForm, setTouched, ...formikProps }) => (
        <Form
          className="row main-form"
          encType="multipart/form-data"
          onSubmit={async (e) => {
            e.preventDefault();
            const errors = await validateForm();
            if (Object.keys(errors).length > 0) {
              const touchedFields = {};
              Object.keys(errors).forEach((key) => {
                touchedFields[key] = true;
              });
              setTouched(touchedFields);

              setTimeout(() => {
                const errorElement = document.querySelector(
                  ".is-invalid, .text-danger"
                );
                if (errorElement) {
                  errorElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }, 100);

              return;
            }
            handleSubmit(e);
          }}
        >
          {fields.map((field) => (
            <FormikConsumer key={field.name}>
              {({ values }) =>
                !field.showWhen || field.showWhen(values) ? (
                  <div className={field.colClass || "col-12"}>
                    <div className="form-group">
                      {/* Don't show label for custom components as they handle their own labels */}
                      {field.type !== "checkbox" &&
                        field.type !== "radio" &&
                        field.type !== "custom" && (
                          <label
                            htmlFor={field.name}
                            className="contact-label mb-2 fs-6 fw-semibold"
                          >
                            {field.label}
                          </label>
                        )}
                      {renderField(field, formikProps, values)}
                      {/* Only show ErrorMessage for non-custom components */}
                      {field.type !== "custom" && (
                        <ErrorMessage
                          name={field.name}
                          component="div"
                          className="text-danger small mt-1"
                        />
                      )}
                    </div>
                  </div>
                ) : null
              }
            </FormikConsumer>
          ))}

          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-3">
              {SubmitBtn || "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;
