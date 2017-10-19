/* @flow */
import * as React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

// mount
const el = document.createElement('main')
document.body && document.body.prepend(el)

ReactDOM.render(<App />, el)
