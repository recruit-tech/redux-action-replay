/* @flow */
import React from 'react'
import ReactDOM from 'react-dom'
import { RECORDING_START, RECORDING_END } from './constants'
declare var URL
declare var Blob

let el = null

export function unmount() {
  el && el.remove()
}

export default function renderUI(props: {
  recording: boolean,
  result: ?string,
  dispatch: Function
}) {
  if (typeof window === 'undefined') {
    // Support browser env only
    return
  }
  const mounted = !!document.querySelector('.__recorder')
  if (!mounted) {
    el = document.createElement('div')
    el.className = '__recorder'
    el.style.position = 'fixed'
    el.style.top = '3px'
    el.style.right = '3px'
    el.style.backgroundColor = 'rgba(1, 1, 1, 0.5)'
    el.style.borderRadius = '3px'
    el.style.padding = '4px'
    document.body && document.body.prepend(el)
  }

  let textareaRef = null
  ReactDOM.render(
    <div>
      <div style={{ marginLeft: 'auto' }}>
        {props.recording
          ? [
              <span key="recording" style={{ color: 'white' }}>
                Recording…
              </span>,
              <button
                key="record"
                onClick={() => props.dispatch({ type: RECORDING_END })}
              >
                <span style={{ color: 'red' }}>x</span>
                End
              </button>
            ]
          : [
              <button
                key="record"
                onClick={() => props.dispatch({ type: RECORDING_START })}
              >
                <span style={{ color: 'red' }}>●</span>
                Rec
              </button>,
              <button key="unmount" onClick={() => unmount()}>
                x
              </button>
            ]}
      </div>
      {props.result ? (
        <p>
          <button
            onClick={() => {
              textareaRef && textareaRef.select()
              document.execCommand('copy')
            }}
          >
            Copy to clipboard
          </button>
          <a
            download={Date.now().toString() + '-actions.json'}
            href={URL.createObjectURL(
              new Blob([props.result], {
                type: 'application/json'
              })
            )}
          >
            Download
          </a>
          <textarea
            readOnly
            value={props.result}
            style={{ minHeight: '300px', width: '100%' }}
            ref={ref => (textareaRef = ref)}
          />
        </p>
      ) : null}
    </div>,
    el
  )
}
