import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import Home from "./Home/Home";
import Navbar from "./Navbar/Navbar";
import Auth from "./Auth/Auth";
import { UserContext } from "./user-context";
import "./App.scss";
import AppLoader from "./AppLoader/AppLoader";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoding] = useState<boolean>(true);
  useEffect(() => {
    axios("/me")
      .then((res) => {
        setUser(res.data);
        setLoding(false);
      })
      .catch((err) => {
        setUser(null);
        setLoding(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading && <AppLoader />}
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Auth} />
        <Route path='/signup' component={Auth} />
      </Switch>
    </UserContext.Provider>
  );
};

export default App;
