/* @flow */
import isPlainObject from 'lodash.isplainobject'
import renderUI from './renderUI'
import { RECORDING_START, RECORDING_END, BACKDOOR_FOR_STORE } from './constants'

declare var performance
declare var location

export const replayer = (store: any) => {
  global[BACKDOOR_FOR_STORE] = store
  return (next: Function) => (action: any) => {
    return next(action)
  }
}

export const recorder = (opts: { ui: boolean } = { ui: true }) => {
  let recording = false
  let actionSeries: any = null

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
        console.log(seriarized)
      } else if (recording && isPlainObject(action)) {
        console.info('recording:record', action)
        actionSeries.push({
          dispatchedAction: action,
          timestamp: performance.now()
        })
      }
      // console.log('before: %O', store.getState())
      next(action)
    }
  }
}
