/* @flow */
import { REPLACEABLE } from './constants'
import { applyMiddleware, createStore } from 'redux'
import { replayer } from './middleware'

export function isPuppeteerEnv() {
  return (
    typeof navigator !== 'undefined' &&
    navigator.userAgent.indexOf('HeadlessChrome') > -1
  )
}

export const replaceable = (reducer: Function) => (
  state: any = reducer(undefined, { type: 'noop' }),
  action: any = {}
) => {
  return action.type === REPLACEABLE ? action.payload : reducer(state, action)
}

export function createAutomateStore(reducer: Function) {
  return createStore(replaceable(reducer), undefined, applyMiddleware(replayer))
}
