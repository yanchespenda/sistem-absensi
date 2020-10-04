import React from 'react'
import ReactDOM from 'react-dom'

import axios from "axios"
import { SWRConfig } from 'swr'

import App from './App'
import theme from './theme'
import * as serviceWorker from './serviceWorker'
// import {createStore, applyMiddleware} from 'redux'
// import thunk from 'redux-thunk'
// import {Provider} from 'react-redux'
// import store from './redux/store'

import './index.scss'
import './grid.scss'

import { ThemeProvider, CssBaseline } from '@material-ui/core'

// const store = createStore(store, applyMiddleware(thunk))

ReactDOM.render(
  <ThemeProvider theme={ theme }>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {/* <Provider store={ store }> */}
    <SWRConfig
      value={{ 
        fetcher: (url: string) => axios(url).then((r) => r.data),
        onError: error => {
          if (error.status !== 403 && error.status !== 404) {
            // setIsSnackbarOpen(true)

            /* console.group('SWR Error')
            console.log('error', error)
            console.log('errorMessage', error.message)
            console.log('key', key)
            console.groupEnd() */
          }
        }
      }}>
        <App />
      </SWRConfig>
    {/* </Provider> */}
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
