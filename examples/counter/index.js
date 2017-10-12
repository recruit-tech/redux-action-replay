/* @flow */
import * as React from 'react'
import ReactDOM from 'react-dom'

const el = document.createElement('main')
el.id = '--root'
document.body.prepend(el)

const App = require('./components/App').default
ReactDOM.render(<App />, el)
