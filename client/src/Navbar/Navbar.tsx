import React, { useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../user-context";

const Navbar: React.FC = () => {
  const userContext = useContext(UserContext);
  const history = useHistory();

  const logout = async () => {
    const res = await axios.post("logout");
    if (res.status === 200) {
      history.push("/login");
      userContext.setUser(null);
    }
  };

  return (
    <Menu>
      {userContext && userContext.user ? (
        <>
          <Menu.Item as={Link} to='/'>
            שלום {userContext.user.role === "admin" ? "מנהל" : "משתמש"}{" "}
            {userContext.user.username}
          </Menu.Item>
          <Menu.Item onClick={logout}>התנתקות</Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item as={Link} to='/login'>
            התחבר
          </Menu.Item>
          <Menu.Item as={Link} to='/signup'>
            הרשם
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default Navbar;
