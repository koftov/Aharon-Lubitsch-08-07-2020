import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { Form, Container, Input, Button } from "semantic-ui-react";
import { UserContext } from "../user-context";

interface AuthProps extends RouteComponentProps {
  path: string;
}

const Auth = (props: AuthProps) => {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const request = props.match.path === "/login" ? "/login" : "/signup";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError(null);
    e.preventDefault();
    if (!user.username || !user.password) {
      setError("אנא הכנס את כל השדות");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post<User>(request, user);
      setLoading(false);
      userContext.setUser(res.data);
      props.history.push("/");
    } catch (err) {
      setLoading(false);
      if (request === "/login") {
        setError("שם משתמש או סיסמא לא נכונים, אנא נסה שוב.");
      } else {
        setError(
          "שם משתמש או סיסמא לא נכונים, או שהמשתמש כבר קיים במערכת אנא נסה שוב."
        );
      }
    }
  };

  const status = request === "/login" ? "התחברות" : "הרשמה";

  return (
    <Container>
      <h1>{status}</h1>
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Field
          control={Input}
          placeholder="שם משתמש"
          type="username"
          name="username"
          onChange={handleChange}
        />
        <Form.Field
          control={Input}
          placeholder="סיסמה"
          type="password"
          name="password"
          onChange={handleChange}
          minLength="6"
        />
        <p style={{ color: "red" }}>{error}</p>
        <Form.Field
          control={Button}
          type="submit"
          disabled={!user.password || !user.username}
        >
          {status}
        </Form.Field>
      </Form>
    </Container>
  );
};

export default Auth;
