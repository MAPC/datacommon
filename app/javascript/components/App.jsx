import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Faq from './Faq';
import Home from '../containers/Home';
import Header from './partials/Header';
import Footer from './partials/Footer';
import CommunityProfiles from '../containers/CommunityProfiles';
import Gallery from './Gallery';
import Login from './Login';
import Admin from './Admin';
import { AuthContext } from "./context/auth";
import PrivateRoute from './PrivateRoute';

function App(props) {
  const [authTokens, setAuthTokens] = useState();
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <section className="component App">
        <Header location={props.location} />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/faq" component={Faq} />
            <Route path="/profile/:muni/:tab?" render={(props) =>
              this.props.muniOptions.includes(props.match.params.muni)
                ? (this.props.tabOptions.includes(props.match.params.tab)
                  ? (<CommunityProfiles {...props} />)
                  : (<Redirect to={`/profile/${props.match.params.muni}/${this.props.tabOptions[0]}`} />))
                : (<Redirect to={'/'} />)
              }
            />
            <Route exact path="/gallery" component={Gallery} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/admin" component={Admin} />
            </Switch>
          </main>

          <Footer />
        </section>
      </AuthContext.Provider>
  );

};

export default App;
