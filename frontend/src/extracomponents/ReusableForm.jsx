import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikConsumer } from "formik";
import Select from "react-select";
import { Eye, EyeOff } from "lucide-react"; // optional icons

const PasswordField = ({ field }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field name={field.name}>
      {({ field: formikField }) => (
        <div className="input-group">
          <input
            {...formikField}
            type={showPassword ? "text" : "password"}
            placeholder={field.placeholder}
            className="form-control contact-input"
            id={field.name}
            autoComplete={field.autoComplete}
          />
          <button
            type="button"
            className="btn btn-secondary "
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      )}
    </Field>
  );
};


const renderField = (field, formikProps, values) => {
  const { errors, touched, setFieldValue, setFieldTouched } = formikProps;

  if (field.type === "custom" && field.customComponent) {
    return field.customComponent({
      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      ...formikProps,
    });
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
          disabled={field.disabled}
        />
      );

    case "password":
      return <PasswordField field={field} />; // 👈 use custom password field

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
              disabled={field.disabled}
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
              onChange={(e) => {
                let value = e.target.value;
                if (field.numeric) {
                  value = value.replace(/[^0-9]/g, "");
                  if (field.maxLength) {
                    value = value.slice(0, field.maxLength);
                  }
                }
                form.setFieldValue(field.name, value);
                if (field.onChange) {
                  field.onChange(e, form.setFieldValue);
                }
              }}
              disabled={field.disabled}
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
              {(formikConsumerProps) =>
                !field.showWhen || field.showWhen(formikConsumerProps.values) ? (
                  <div className={field.colClass || "col-12"}>
                    <div className="form-group">
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
                      {renderField(
                        field,
                        formikConsumerProps,
                        formikConsumerProps.values
                      )}
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
