# Redux Action Replay

Replay your redux actions in your application by puppeteer.

Get renderer metrics and take screenshots.

## Install

```
npm install redux-action-replay
```

## CLI

```
$ npm install redux-action-replay -g
$ par myscenario.json
```

## Concepts

- Redux actions is good clue to replay application state.
- Headless Chrome is best way to integrate test.
- This is a **weak** e2e.
  - Your application is controlled by redux action and puppeteer.
  - It's helpful for renderer metrics and take screenshots.

## How to use

Add this code to record your actions.

```js
// src/store/create.js
import { applyMiddleware } from 'redux'
import reduxPromise from 'redux-promise'
import { recorder, withReplacer, createStore } from 'redux-action-replay'
import reducer from '../reducers'

export default () => {
  return createStore(
    reducer,
    undefined,
    applyMiddleware(reduxPromise),
    { ui: true } // recorder option
  )
}
```

or

```js
// src/store/create.js
import { createStore, applyMiddleware } from 'redux'
import reduxPromise from 'redux-promise'
import { recorder, withReplacer } from 'redux-action-replay'
import reducer from '../reducers'
export default () => {
  return createStore(
    // Wrap your reducer
    // to restore recorded state in replay mode
    withReplacer(reducer),
    undefined,
    // Set recorder as first middleware
    // to prevent next middleware in replay mode
    applyMiddleware(recorder({ ui: true }), reduxPromise)
  )
}
```


Record your actions in your app.

![](https://i.gyazo.com/c3908bfaf082bef82d735e43b067218d.gif)

Save json.

Run with cli.

```sh
# npm install redux-action-replay -g
# or use via ./node_modules/.bin/par
$ par myscenario.json
```

Run with node

```js
/* @flow */
import run from 'redux-action-replay/runner'

const scenario = require('./scenarios/test-actions.json')
run(scenario, {
  screenshot: true
})
```

Results.

```
delta > counter/add { Timestamp: 0.5370970000003581,
  JSEventListenerCount: 6,
  LayoutCount: 1,
  LayoutDuration: 0.00020599999879777903,
  ScriptDuration: 0.0007769999992887997,
  TaskDuration: 0.003832000002148502,
  JSHeapUsedSize: 31344 }
delta > counter/add { Timestamp: 0.537903999998889,
  JSEventListenerCount: 6,
  LayoutCount: 1,
  LayoutDuration: 0.000404000000344241,
  ScriptDuration: 0.0005920000003242984,
  TaskDuration: 0.003926999996110701,
  JSHeapUsedSize: 31088 }
delta > counter/add { Timestamp: 0.5443740000009711,
  JSEventListenerCount: 6,
  LayoutCount: 1,
  LayoutDuration: 0.00027700000100594,
  ScriptDuration: 0.0012000000006083013,
  TaskDuration: 0.004784000006111497,
  JSHeapUsedSize: 31088 }
delta > counter/add { Timestamp: 0.541692000000694,
  JSEventListenerCount: 6,
  LayoutCount: 1,
  LayoutDuration: 0.00021600000036414995,
  ScriptDuration: 0.0006799999991927014,
  TaskDuration: 0.0036060000002180043,
  JSHeapUsedSize: 31088 }
delta > counter/add { Timestamp: 0.5375689999982569,
  JSEventListenerCount: 6,
  LayoutCount: 1,
  LayoutDuration: 0.0005600000004051301,
  ScriptDuration: 0.0007479999985661977,
  TaskDuration: 0.004369999996924896,
  JSHeapUsedSize: 31088 }
delta > automator/recording-end { Timestamp: 0.5751890000010462,
  TaskDuration: 0.0034789999972417995,
  JSHeapUsedSize: 8928 }
```

## TODO

- Meaningful renderer analyze
- image diff utilities

## License

MIT
