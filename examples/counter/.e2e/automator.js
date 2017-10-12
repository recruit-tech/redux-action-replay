/* @flow */
import run from 'redux-action-replay/runner'

const scenario = require('./scenarios/test-actions.json')
run(scenario, {
  screenshot: true,
  headless: false
})
