/* @flow */
import { createStore, applyMiddleware } from 'redux'
import reduxPromise from 'redux-promise'
import reducer from '../reducers'
import { recorder, withReplacer, isPuppeteerEnv } from 'redux-action-replay'

console.log('isp', isPuppeteerEnv())

export default () => {
  return createStore(
    // withReplacer(reducer),
    reducer,
    undefined,
    applyMiddleware(recorder({ ui: true }), reduxPromise)
  )
}
