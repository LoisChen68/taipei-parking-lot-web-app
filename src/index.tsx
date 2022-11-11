import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals'
import {BrowserRouter} from 'react-router-dom'
import Tracker from '@openreplay/tracker'


const tracker = new Tracker({
  projectKey: process.env.REACT_APP_PROJECT_KEY || '',
});
tracker.start();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const BASE_URL = 'taipei-parking-lot-web-app'
root.render(
  <React.StrictMode>
    <BrowserRouter
      basename={BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()