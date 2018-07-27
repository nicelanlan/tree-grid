import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEvent from 'react-tap-event-plugin';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.scss';
injectTapEvent();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
