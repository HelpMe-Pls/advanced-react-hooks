// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

const countReducer = (state, newState) => state + newState

function Counter({initialCount = 0, step = 1}) {
	// 🐨 replace React.useState with React.useReducer.
	// const [count, setCount] = React.useState(initialCount)

	const [count, changeCount] = React.useReducer(countReducer, initialCount)

	const increment = () => changeCount(step)
	return <button onClick={increment}>{count}</button>
}

function App() {
	return <Counter />
}

export default App
