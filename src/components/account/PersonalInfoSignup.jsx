import { Formik, Field, ErrorMessage } from "formik";

import AccountWrapper from "@/components/account/AccountWrapper";
import style from "@/styles/account.module.css";

import states from "../../../data/states.json"

const PersonalInfoSignup = (props) => {
  const currentDate = new Date().toISOString().slice(0, 10);

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        insurance: "",
        memberId: "",
        medicalDegree: "",
        medicalSpecialty: "",
        npiNumber: "",
        experience: "",
        languages: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
        }, 500);

        props.handleSubmission(values);
      }}
    >
      {({ values }) => (
        <AccountWrapper
          url="/login"
          urlText="Log in"
          propmtText="Have an account?&nbsp;"
        >
          <div className={style.personal_info_container}>
            <div className={style.signup_left}>
              <Field name="firstName" placeholder="First Name" required />
              <Field name="lastName" placeholder="Last Name" required />
              <Field
                name="dateOfBirth"
                placeholder="Date of Birth (mm/dd/yyyy)"
                onFocus={(e) => (e.target.type = "date")}
                type={values.dateOfBirth === "" ? "text" : "date"}
                min="1920-01-01"
                max={currentDate}
                required
              />
              <div className={style.gender_field}>
                <Field
                  className={
                    values.gender === "" ? style.gender_unselected : ""
                  }
                  name="gender"
                  placeholder="Gender"
                  as="select"
                  required
                >
                  <option value="" disabled defaultChecked hidden>
                    Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="unknown">Prefer not to say</option>
                </Field>
                <span className={style.select_arrow}>▼</span>
              </div>
              <Field
                name="phone"
                placeholder="Phone No (e.g. 2155551234)"
                type="tel"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>
            <div className={style.signup_right}>
              {props.isPatient ? (
                <div>
                  <Field
                    name="street"
                    placeholder="Street Address"
                    type="text"
                    required
                  />
                  <Field name="city" placeholder="City" type="text" required />
                  <div className={style.info_row}>
                    <div className={style.state_field}>
                        <Field
                        className={
                            values.state === "" ? style.state_unselected : ""
                        }
                        name="state"
                        placeholder="State"
                        as="select"
                        required
                        >
                        <option key="state" value="" disabled defaultChecked hidden>
                            State
                        </option>
                        {states.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.code}
                          </option>
                        ))}
                        </Field>
                        <span className={style.select_arrow}>▼</span>
                    </div>
                    <Field
                      name="zip"
                      placeholder="ZIP Code"
                      type="text"
                      required
                    />
                  </div>
                  <Field
                    name="insurance"
                    placeholder="Insurance Provider"
                    type="text"
                    required
                  />
                  <Field
                    name="memberId"
                    placeholder="Member ID"
                    type="text"
                    required
                  />
                </div>
              ) : (
                <div>
                  <Field
                    name="medicalDegree"
                    placeholder="Medical Degree"
                    type="text"
                    required
                  />
                  <Field
                    name="medicalSpecialty"
                    placeholder="Medical Specialty"
                    type="text"
                    required
                  />
                  <Field
                    name="npiNumber"
                    placeholder="NPI Number"
                    type="number"
                    min="0"
                    required
                  />
                  <Field
                    name="experience"
                    placeholder="Years of Experience"
                    type="number"
                    min="0"
                    required
                  />
                  <Field
                    name="languages"
                    placeholder="Languages Spoken"
                    type="text"
                    required
                  />
                </div>
              )}
            </div>
          </div>
          <button type="submit">Submit</button>
        </AccountWrapper>
      )}
    </Formik>
  );
};

export default PersonalInfoSignup;
