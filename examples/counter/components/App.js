/* @flow */
import * as React from 'react'
import { Provider } from 'react-redux'
import createStore from '../store/create'
import Counter from './Counter'

export default function App() {
  const store = createStore()
  return (
    <Provider store={store}>
      <div>
        <h1>App</h1>
        <Counter />
      </div>
    </Provider>
  )
}
