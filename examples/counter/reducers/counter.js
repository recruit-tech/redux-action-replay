/* @flow */
type __ReturnType<B, _F: (...any) => Promise<B> | B> = B
type $ReturnType<F> = __ReturnType<*, F>

const ADD = 'counter/add'
export function add(n: number): { type: typeof ADD, payload: number } {
  return {
    type: ADD,
    payload: n
  }
}

type Action = $ReturnType<typeof add>

type State = {
  value: number
}

const initialState: State = {
  value: 0
}

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ADD: {
      return {
        value: state.value + action.payload
      }
    }
    default: {
      return state
    }
  }
}
