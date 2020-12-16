import React, { useState, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Container, Input, Button, Message } from "semantic-ui-react";
import { UserContext } from "../user-context";

interface AuthProps extends RouteComponentProps {
  path: string;
}

const Auth = (props: AuthProps) => {
  const userContext = useContext(UserContext);
  const [error, setError] = useState<string | null>(null);

  const request = props.match.path === "/login" ? "/login" : "/signup";

  const validationSchema = yup.object({
    username: yup.string().required().min(2).max(20),
    password: yup.string().required().min(6).max(20),
  });

  const status = request === "/login" ? "התחברות" : "הרשמה";

  return (
    <Container>
      <h1>{status}</h1>
      <Formik
        validateOnChange={true}
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          setSubmitting(true);

          try {
            const res = await axios.post<User>(request, data);
            userContext.setUser(res.data);
            props.history.push("/");
          } catch (err) {
            if (request === "/login") {
              setError("שם משתמש או סיסמא לא נכונים, אנא נסה שוב.");
            } else {
              setError(
                "שם משתמש או סיסמא לא נכונים, או שהמשתמש כבר קיים במערכת אנא נסה שוב."
              );
            }
          }

          setSubmitting(true);
        }}
      >
        {({ values, dirty, touched, errors, isValid, isSubmitting }) => (
          <Form>
            <Field
              fluid
              as={Input}
              placeholder="שם משתמש"
              type="username"
              name="username"
              value={values.username}
              error={touched.username && errors.username}
            />
            <p style={{ color: "red" }}>
              {errors.username && touched.username && errors.username}
            </p>
            <Field
              fluid
              as={Input}
              placeholder="סיסמה"
              type="password"
              name="password"
              value={values.password}
              error={touched.password && errors.password}
            />
            <p style={{ color: "red" }}>
              {errors.password && touched.password && errors.password}
            </p>
            <Button
              type="submit"
              disabled={!dirty || !isValid}
              loading={isSubmitting}
            >
              {status}
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Auth;
