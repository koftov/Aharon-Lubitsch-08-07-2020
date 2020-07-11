import React, { useContext } from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { UserContext } from '../user-context';

const Navbar: React.FC = () => {
  const userContext = useContext(UserContext);
  const history = useHistory();

  const logout = () => {
    Axios.post('logout').then((res) => {
      if (res.status === 200) {
        history.push('/login');
        userContext.setUser(null);
      }
    });
  };
  return (
    <Menu>
      {userContext && userContext.user ? (
        <>
          <Menu.Item name="Home" as={Link} to="/">
            דף הבית
          </Menu.Item>
          <Menu.Item>
            שלום {userContext.user.role === 'admin' ? 'מנהל' : 'משתמש'}{' '}
            {userContext.user.email}
          </Menu.Item>
          <Menu.Item name="Logout" as={Button} onClick={logout}>
            התנתקות
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item name="Login" as={Link} to="/login">
            התחבר
          </Menu.Item>
          <Menu.Item name="Signup" as={Link} to="/signup">
            הרשם
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default Navbar;
