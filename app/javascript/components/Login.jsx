import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "./context/auth"

function Login() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    axios.post("https://www.somePlace.com/auth/login", {
      userName,
      password
    }).then(result => {
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <section className="route Login">
      <section className="container login__frame">
        <h2>Log In</h2>
        <form className="login__form">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" onChange={e => setUserName(e.target.value)}></input>
          <label htmlFor="pass">Password (8 characters minimum):</label>
          <input type="password" id="pass" name="password" required onChange={e => setPassword(e.target.value)}></input>
          <input type="submit" value="Submit" className="submit" onClick={postLogin}></input>
        </form>
        { isError && <p>The username or password provided were incorrect!</p> }
      </section>
    </section>
  );
}

export default Login;