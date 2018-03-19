import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ClusterApp from './clusterApp'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ClusterApp />, document.getElementById('root'));
registerServiceWorker();
