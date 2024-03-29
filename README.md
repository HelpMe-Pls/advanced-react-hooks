# What I've learnt
###### *For more details, see [`src/exercise/*.md`](https://github.com/HelpMe-Pls/advanced-react-hooks/tree/master/src/exercise) files*
-------------
## `useReducer`
- [How](https://codesandbox.io/s/how-usereducer-works-3bhcp) it works.
- [Type checking](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/extra/src/final/TS/01.extra-3.tsx) using `typeof` keyword to support an `action` in function and object form.
- The [classic Redux `dispatch`](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/master/src/final/TS/01.tsx) approach to `useReducer()`.

## `useCallback` - custom hooks
- [Consider](https://kentcdodds.com/blog/usememo-and-usecallback) **when** to `useCallback`.
- Wrap a function in a `useCallback()` if it's listed in `useEffect()`'s dep arr.
- [Discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) for typing a promise's responses (note: [this won't work (line 94)](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/extra/src/final/TS/02.tsx) for destructured `state` properties).
- Avoiding *race condition* by [type checking](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/extra/src/final/TS/02.tsx) the state's promise vs the action's promise.
- Abort unused requests [(at line 122)](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/extra/src/final/TS/02.tsx) by using the `new AbortController()` interface.
- Preventing memory leak by [cleaning up](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/master/src/exercise/02.js) the `ref` (example at the `useSafeDispatch` definition).
- Dependency array ([at 3:00](https://epicreact.dev/modules/advanced-react-hooks/usecallback-custom-hooks-solution)).
- Spreading state object (in the custom hook defintion) and then destructuring it when we use that custom hook ([Extra Credit 2 at `useAsync()` hook](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/master/src/exercise/02.js)).

## `useContext`
- Basic implementation of `context` API.
- [Sometimes](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/extra/src/final/TS/03.tsx) you don’t need context. The biggest use case for context is for libraries that need to implicitly share state between components (i.e. *compound component*).

## `useLayoutEffect`
- `useLayoutEffect()` is invoked AFTER the render (DOM mutations) but BEFORE the browser paints the change. Use it if you need to mutate the DOM (making observable changes to the DOM) and/or **do need** to perform measurements that are essential to the browser paint (the appearance or placement of the UI elements on the screen). [Example](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/extra/src/final/TS/04.tsx).

## `useImperativeHandle`
- Use `React.forwardRef` to pass a `ref` prop to a function component
- Assigning custom methods to `ref.current` by using [`useImperativeHandle`](https://github.com/HelpMe-Pls/advanced-react-hooks/blob/extra/src/final/TS/05.tsx) hook.

## `useDebugValue`    
- `useDebugValue` can **only** be called inside of a custom hook and is used to label custom hooks so you can easily identify them in the React DevTools.

## `useId`
- The `useId()` hook takes no argument and helps generate a unique stable Id (as a `string`) [on both](https://youtu.be/_vwCKV7f_eA?t=188) the client-side and server-side.
- Most common usage:
```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
}

// For multiple IDs in the same component, append a suffix using the same `id`:
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```
- The `useId()` hook is **not** used for generating the value of the `key` prop.
