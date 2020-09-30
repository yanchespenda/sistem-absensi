import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import './grid.scss'

import App from './App'
import theme from './theme'
import * as serviceWorker from './serviceWorker'
// import {createStore, applyMiddleware} from 'redux'
// import thunk from 'redux-thunk'
// import {Provider} from 'react-redux'
// import store from './redux/store'

import { ThemeProvider, CssBaseline } from '@material-ui/core'

// const store = createStore(store, applyMiddleware(thunk))

ReactDOM.render(
  <ThemeProvider theme={ theme }>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {/* <Provider store={ store }> */}
      <App />
    {/* </Provider> */}
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
