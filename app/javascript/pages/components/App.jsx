import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Faq from './Faq';
import Gallery from './Gallery';
import Login from './Login';
import Admin from './Admin';
import Home from '../containers/Home';
import Header from './partials/Header';
import Footer from './partials/Footer';
import CommunityProfiles from '../containers/CommunityProfiles';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';
import Calendar from './Calendar';
import Browser from '../containers/Browser';
import DataViewer from '../containers/DataViewer';

const App = (props) => (
  <section className="component App">
    <Header location={props.location} />
    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/faq" component={Faq} />
        <Route
          path="/profile/:muni/:tab?"
          render={(props2) => (props.muniOptions.includes(props2.match.params.muni)
            ? (props.tabOptions.includes(props2.match.params.tab)
              ? (<CommunityProfiles {...props2} />)
              : (<Redirect to={`/profile/${props2.match.params.muni}/${props.tabOptions[0]}`} />))
            : (<Redirect to="/" />))}
        />
        <Route exact path="/gallery" component={Gallery} />
        <Route exact path="/login" component={Login} />
        <Route path='/calendar/:year/:month' component={Calendar} />
        <Route path='/browser/datasets/:id' component={DataViewer} />
        <Route path='/browser/:menuOneSelectedItem' component={Browser} />
        <Route path='/browser' component={Browser} />
        <PrivateRoute exact path="/admin" component={Admin} />
      </Switch>
    </main>
    <Footer />
  </section>
);

export default App;
