import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Faq from './Faq';
import Home from '../containers/Home';
import Header from './partials/Header';
import Footer from './partials/Footer';
import CommunityProfiles from '../containers/CommunityProfiles';


class App extends React.Component {

  render() {
    return (
      <section className="component App">
        <Header location={this.props.location} />

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
          </Switch>
        </main>

        <Footer />
      </section>
    );
  }

};

export default App;
