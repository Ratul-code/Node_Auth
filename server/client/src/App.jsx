import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./component/Auth";
import Feed from "./component/Feed";
import ResetScreen from "./component/ResetScreen";
import PrivateRoute from "./routing/PrivateRoute";
import axios from "axios";
import { useAuth } from "./helpers/AuthContext";
axios.defaults.withCredentials = true;
const App = () => {
  const { authenticated, setAuthenticated } = useAuth();
  const getAuthState = async () => {
    const { data } = await axios.get("http://localhost:5000/api/auth/loggedin");
    setAuthenticated(data.loggedin);
  };
  useEffect(() => {
    getAuthState();
  }, []);
  console.log("rendering");
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/private" exact element={<Hello />} />
        </Route>
        <Route path="/" exact element={!authenticated ? <Auth /> : <Feed />} />
        <Route path="/auth/resetpass" exact element={<ResetScreen />} />
        <Route
          path={`/auth/resetpass/:resetToken`}
          exact
          element={<ResetScreen />}
        />
      </Routes>
    </Router>
  );
};

const Hello = () => {
  return <h1>hello</h1>;
};
export default App;
