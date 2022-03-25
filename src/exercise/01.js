// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// {newState} === currentState => ({count: currentState.count + step})
// therefore: newState(state) === (state => ({count: state.count + step}))()
const countReducer = (state, newState) => ({
	// the spread operator is for the case where the state is an object
	...state,
	...(typeof newState === 'function' ? newState(state) : newState),
})

function Counter({initialCount = 0, step = 1}) {
	const [state, setState] = React.useReducer(countReducer, {
		count: initialCount,
	})
	const {count} = state
	const increment = () =>
		setState(currentState => ({count: currentState.count + step}))

	return <button onClick={increment}>{count}</button>
}

function App() {
	return <Counter />
}

export default App
