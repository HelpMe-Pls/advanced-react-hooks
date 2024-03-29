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

function useSafeDispatch(dispatch) {
	const mountedRef = React.useRef(false)

	// to make this even more generic you should use the `useLayoutEffect()` hook to
	// make sure that you are correctly setting the mountedRef.current immediately
	// after React updates the DOM. Even though this effect does not interact
	// with the dom, another side effect inside a useLayoutEffect which does
	// interact with the dom may depend on the value being set
	// More details at 05:35 from https://epicreact.dev/modules/advanced-react-hooks/usecallback-custom-hooks-extra-credit-solution-3
	React.useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
		}
	}, [])

	return React.useCallback(
		// `void 0`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void#description

		(...args) => (mountedRef.current ? dispatch(...args) : void 0),
		[dispatch], //https://devtrium.com/posts/dependency-arrays#refs
	)
}

function useAsync(initialState) {
	const [state, vulnerableDispatch] = React.useReducer(pokemonInfoReducer, {
		// Coz this hook supposed to be generic so assuming that we "don't" know what the {pokemonName} is, therefore we'll have to merge the `status` with `initialState`
		status: 'idle',
		data: null,
		error: null,
		...initialState,
	})

	const dispatch = useSafeDispatch(vulnerableDispatch)

	const run = React.useCallback(
		promise => {
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
		},
		[dispatch],
	)

	return {...state, run}
}

function PokemonInfo({pokemonName}) {
	const {data, status, error, run} = useAsync({
		status: pokemonName ? 'pending' : 'idle',
	})

	React.useEffect(() => {
		if (!pokemonName) {
			return
		}
		// 💰 note the absence of `await` here. We're literally passing the promise
		// to `run` so `useAsync` can attach it's own `.then` handler on it to keep
		// track of the state of the promise.
		const pokemonPromise = fetchPokemon(pokemonName)
		run(pokemonPromise)
	}, [pokemonName, run])

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
