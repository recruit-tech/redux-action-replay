/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as counterActions from '../reducers/counter'

const mapStateToProps = state => state.counter
const bindActions = dispatch => bindActionCreators(counterActions, dispatch)

type Props = {
  value: number,
  add: Function
}

export default connect(
  mapStateToProps,
  bindActions
)(({ value, add }: Props) => {
  return (
    <div>
      <h2>Counter</h2>
      <p>value: {value}</p>
      <div>
        <button onClick={() => add(1)}>Add 1</button>
      </div>
    </div>
  )
})
