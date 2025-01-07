
/* import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'; */

// add global styles
import '../styles/app.scss';

// add the react application entry point
import '../pages/index';

// add polyfills
require('es6-promise').polyfill();
require('isomorphic-fetch');
