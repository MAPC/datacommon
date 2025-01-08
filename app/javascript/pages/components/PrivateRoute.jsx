import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const authTokens = useAuth();
  return(
    <Route {...rest} render={(props) => (
        authTokens ? (
            <Component {...props} />
        ) : (
            <Navigate to="/"/>
        )
    )}
    />
  );
}

export default PrivateRoute;
