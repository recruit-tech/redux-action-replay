/* @flow */
import { createStore as createStoreRedux, applyMiddleware } from 'redux'
import { REPLACEABLE } from './constants'
import { recorder } from './middleware'

export function isPuppeteerEnv() {
  return (
    typeof navigator !== 'undefined' &&
    navigator.userAgent.indexOf('HeadlessChrome') > -1
  )
}

export const withReplacer = (reducer: Function) => (
  state: any = reducer(undefined, { type: 'noop' }),
  action: any = {}
) => {
  return action.type === REPLACEABLE ? action.payload : reducer(state, action)
}

export const createStore = (
  reducer: Function,
  initialState: any,
  middleware: Function,
  opts?: any
) => {
  createStoreRedux(
    withReplacer(reducer),
    initialState,
    applyMiddleware(recorder(opts), middleware)
  )
}
