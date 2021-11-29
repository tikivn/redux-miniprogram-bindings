import { Store, AnyAction, Dispatch, Unsubscribe } from 'redux'
import { SubscribeHandler, IAnyObject, Selector, Ref } from '../types'
import { getProvider } from '../provider'

export const useStore = (): Store<IAnyObject, AnyAction> => getProvider().store

export const useState = (): IAnyObject => getProvider().store.getState()

export const useDispatch = (): Dispatch<AnyAction> => getProvider().store.dispatch

export function useSubscribe(handler: SubscribeHandler): Unsubscribe {
  const { store } = getProvider()
  let prevState = <IAnyObject>store.getState()
  return store.subscribe(() => {
    const currState = <IAnyObject>store.getState()
    handler(currState, prevState)
    prevState = currState
  })
}

export function useRef<V = unknown>(selector: Selector<V>): Ref<V> {
  const { store } = getProvider()
  const ref = {} as Ref<V>
  Object.defineProperty(ref, 'value', {
    configurable: false,
    enumerable: true,
    get() {
      return selector(store.getState())
    },
  })

  return ref
}

export function useSelector<V = unknown>(selector: Selector<V>, deps?: string[]): Selector<V> {
  // When the dependency is illegal or there is no dependency, return the original function passed in
  if (!Array.isArray(deps) || deps.length < 1) {
    return selector
  }

  let lastState: IAnyObject = {}
  let lastResult: V
  return function (state: IAnyObject) {
    // Determine whether the dependent state has changed through shallow comparison, and decide whether to re-execute the function
    if (deps.some((k) => lastState[k] !== state[k])) {
      lastState = state
      lastResult = selector(state)
    }
    return lastResult
  }
}
