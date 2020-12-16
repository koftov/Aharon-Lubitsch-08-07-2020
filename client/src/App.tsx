import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import axios from "axios";
import Home from "./Home/Home";
import Navbar from "./Navbar/Navbar";
import Auth from "./Auth/Auth2";
import { UserContext } from "./user-context";
import "./App.scss";
import AppLoader from "./AppLoader/AppLoader";

const App = () => {
  const history = useHistory();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoding] = useState<boolean>(false);
  useEffect(() => {
    async function getUser() {
      setLoding(true);
      try {
        const res = await axios("/me");
        setUser(res.data);
        setLoding(false);
      } catch (err) {
        setLoding(false);
        history.push("/login");
      }
    }
    getUser();
  }, [history]);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        {loading && <AppLoader />}
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Auth} />
          <Route path="/signup" component={Auth} />
        </Switch>
      </UserContext.Provider>
    </div>
  );
};

export default App;
