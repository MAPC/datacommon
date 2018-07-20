import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Faq from './Faq';
import Home from './Home';
import Header from './partials/Header';
import Footer from './partials/Footer';
import CommunityProfiles from '../containers/CommunityProfiles';


class App extends React.Component {

  render() {
    return (
      <section className="component App">
        <Header />

        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/faq" component={Faq} />
            <Route path="/profile/:muni" component={CommunityProfiles} />
          </Switch>
        </main>

        <Footer />
      </section>
    );
  }

};

export default App;
