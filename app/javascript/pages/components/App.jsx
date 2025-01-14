import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import Community from './Community';
import Faq from './Faq';
import Gallery from './gallery/Gallery';
import Login from './Login';
import Admin from './Admin';
import Home from '../containers/Home';
import Header from './partials/Header';
import Footer from './partials/Footer';
import CommunityProfiles from '../containers/CommunityProfiles';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';
import CalendarEntry from './gallery/CalendarEntry';
import Browser from '../containers/Browser';
import DataViewer from '../containers/DataViewer';

// profile route
const ProfileRoute = ({ muniOptions, tabOptions }) => {
  
  const { muni, tab } = useParams();
  
  if (!muniOptions.includes(muni)) {
    return <Navigate to="/" />;
  }
  
  if (!tab || !tabOptions.includes(tab)) {
    return <Navigate to={`/profile/${muni}/${tabOptions[0]}`} />;
  }
  
  return <CommunityProfiles muni={muni} tab={tab} />;
};

const App = ({ muniOptions, tabOptions }) => (
  <section className="component App">
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<Faq />} />
        <Route 
          path="/profile/:muni/:tab?" 
          element={<ProfileRoute muniOptions={muniOptions} tabOptions={tabOptions} />} 
        />
        <Route path="/community" element={<Community />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar/:year/:month" element={<CalendarEntry />} />
        <Route path="/gallery/:year/:month" element={<CalendarEntry /> }/>
        <Route path="/browser/datasets/:id" element={<DataViewer />} />
        <Route path="/browser/:menuOneSelectedItem?/:menuTwoSelectedItem?" element={<Browser />} />
        <Route path="/browser" element={<Browser />} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>
    </main>
    <Footer />
  </section>
);

export default App;
