import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Form, Container, Input, Button } from "semantic-ui-react";
import { UserContext } from "../user-context";

import axios from "axios";

const regEmail: RegExp = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface AuthProps extends RouteComponentProps {
  path: string;
}

const Auth = (props: AuthProps) => {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const request = props.match.path === "/login" ? "/login" : "/signup";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    if (!user.email || !user.password) {
      setError("אנא הכנס את כל השדות");
      return;
    }
    if (!regEmail.test(user.email)) {
      setLoading(false);
      setError('אנא הכנס כתובת דוא"ל חוקית');
      return;
    }
    setLoading(true);
    const res = await axios.post<User>(request, user);
    try {
      if (res.status === 201 || res.status === 200) {
        setLoading(false);
        userContext.setUser(res.data);
        props.history.push("/");
      }
    } catch (err) {
      setLoading(false);
      setError("אימייל או סיסמא לא חוקיים, אנא נסה שוב.");
    }
  };

  const status = request === "/login" ? "התחברות" : "הרשמה";

  return (
    <Container>
      <h1>{status}</h1>
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Field
          control={Input}
          placeholder='אימייל'
          type='email'
          name='email'
          onChange={handleChange}
        />
        <Form.Field
          control={Input}
          placeholder='סיסמה'
          type='password'
          name='password'
          onChange={handleChange}
        />
        <p style={{ color: "red" }}>{error}</p>
        <Form.Field
          control={Button}
          type='submit'
          disabled={!user.password || !user.email}
        >
          {status}
        </Form.Field>
      </Form>
    </Container>
  );
};

export default Auth;
