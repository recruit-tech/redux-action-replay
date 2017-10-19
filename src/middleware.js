/* @flow */
import isPlainObject from 'lodash.isplainobject'
import renderUI from './renderUI'
import {
  RECORDING_START,
  RECORDING_END,
  BACKDOOR_FOR_STORE,
  REDUX_GENEREATED,
  ACTION_REPLAY_GENERATED
} from './constants'
import { isPuppeteerEnv } from './utils'

declare var performance
declare var location

export const replayer = (store: any) => {
  global[BACKDOOR_FOR_STORE] = store
  return (_next: Function) => (action: any) => {
    // We do not need to call _next().
    if (!action.__alreadyForDispatched) {
      store.dispatch({ ...action, __alreadyForDispatched: true })
    }
  }
}

export const recorder = (opts: { ui: boolean } = { ui: true }) => {
  if (isPuppeteerEnv()) {
    // Behave as replayer
    return replayer
  }

  let recording = false
  let actionSeries: any = null

  // Behave as recorder
  return (store: any) => {
    global[BACKDOOR_FOR_STORE] = store
    if (opts.ui) {
      renderUI({
        recording: false,
        result: undefined,
        dispatch: store.dispatch
      })
    }

    return (next: Function) => (action: any) => {
      if (!recording && action.type === RECORDING_START) {
        console.info('recording:start')
        recording = true
        renderUI({ recording, result: undefined, dispatch: store.dispatch })
        actionSeries = [
          {
            type: ACTION_REPLAY_GENERATED,
            dispatchedAction: {
              type: RECORDING_START,
              payload: {
                state: store.getState()
              }
            },
            timestamp: performance.now()
          }
        ]
      } else if (action.type === RECORDING_END) {
        console.info('recording:end')
        recording = false
        actionSeries.push({
          type: ACTION_REPLAY_GENERATED,
          dispatchedAction: {
            type: RECORDING_END,
            payload: {
              state: store.getState()
            }
          },
          timestamp: performance.now()
        })
        const seriarized = JSON.stringify(
          { url: location.href, actionSeries },
          undefined,
          2
        )
        if (opts.ui) {
          renderUI({ recording, result: seriarized, dispatch: store.dispatch })
        }
        console.info('--- recorded ---')
        console.info(seriarized)
      } else if (recording && isPlainObject(action)) {
        console.info('recording:record', action)
        actionSeries.push({
          type: REDUX_GENEREATED,
          dispatchedAction: action,
          timestamp: performance.now()
        })
      }
      next(action)
    }
  }
}
