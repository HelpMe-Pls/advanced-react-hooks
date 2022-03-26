// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
	fetchPokemon,
	PokemonForm,
	PokemonDataView,
	PokemonInfoFallback,
	PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function pokemonInfoReducer(_state, action) {
	switch (action.type) {
		case 'pending': {
			// 🐨 replace "pokemon" with "data"
			return {status: 'pending', data: null, error: null}
		}
		case 'resolved': {
			// 🐨 replace "pokemon" with "data" (in the action too!)
			return {status: 'resolved', data: action.data, error: null}
		}
		case 'rejected': {
			// 🐨 replace "pokemon" with "data"
			return {status: 'rejected', data: null, error: action.error}
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`)
		}
	}
}

function useAsync(asyncCallback, initialState) {
	const [state, dispatch] = React.useReducer(pokemonInfoReducer, {
		// Coz this hook supposed to be generic so assuming that we "don't" know what the {pokemonName} is, therefore we'll have to merge the `status` with `initialState`
		status: 'idle',
		data: null,
		error: null,
		...initialState,
	})

	React.useEffect(() => {
		// 💰 this first early-exit bit is a little tricky, so let me give you a hint:
		const promise = asyncCallback()
		if (!promise) {
			return
		}

		// then you can dispatch and handle the promise etc...
		dispatch({type: 'pending'})
		promise.then(
			data => {
				dispatch({type: 'resolved', data})
			},
			error => {
				dispatch({type: 'rejected', error})
			},
		)
	}, [asyncCallback])
	return state
}

function PokemonInfo({pokemonName}) {
	// Using useCallback() to return the catched fetchPokemon() function if `pokemonName` didn't change between renders:

	const asyncCallback = React.useCallback(() => {
		if (!pokemonName) {
			return
		}

		return fetchPokemon(pokemonName) // `promise`
	}, [pokemonName])

	const state = useAsync(
		// calling the cached `asyncCallback`:
		asyncCallback,

		// initialState:
		{status: pokemonName ? 'pending' : 'idle'},
	)

	const {data, status, error} = state

	switch (status) {
		case 'idle':
			return <span>Submit a pokemon</span>
		case 'pending':
			return <PokemonInfoFallback name={pokemonName} />
		case 'rejected':
			throw error
		case 'resolved':
			return <PokemonDataView pokemon={data} />
		default:
			throw new Error('This should be impossible')
	}
}

function App() {
	const [pokemonName, setPokemonName] = React.useState('')

	function handleSubmit(newPokemonName) {
		setPokemonName(newPokemonName)
	}

	function handleReset() {
		setPokemonName('')
	}

	return (
		<div className="pokemon-info-app">
			<PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
			<hr />
			<div className="pokemon-info">
				<PokemonErrorBoundary
					onReset={handleReset}
					resetKeys={[pokemonName]}
				>
					<PokemonInfo pokemonName={pokemonName} />
				</PokemonErrorBoundary>
			</div>
		</div>
	)
}

function AppWithUnmountCheckbox() {
	const [mountApp, setMountApp] = React.useState(true)

	return (
		<div>
			<label>
				<input
					type="checkbox"
					checked={mountApp}
					onChange={e => setMountApp(e.target.checked)}
				/>{' '}
				Mount Component
			</label>
			<hr />
			{mountApp ? <App /> : null}
		</div>
	)
}

export default AppWithUnmountCheckbox
