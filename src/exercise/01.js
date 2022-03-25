// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

const countReducer = (state, newState) => ({...state, ...newState}) // basically replacing {state} with {newState}

function Counter({initialCount = 0, step = 1}) {
	// 🐨 replace React.useState with React.useReducer.
	// const [count, setCount] = React.useState(initialCount)

	const [state, setState] = React.useReducer(countReducer, {
		count: initialCount,
	})
	const {count} = state
	const increment = () => setState({count: count + step})

	return <button onClick={increment}>{count}</button>
}

function App() {
	return <Counter />
}

export default App
