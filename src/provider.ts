import { ProviderStore, Lifetimes, Provider, ReduxBindingsProvider } from './types'
import { isPlainObject, isFunction, warn } from './utils'

declare const __PLATFORM__: 'tiniapp' | 'wechat' | 'alipay';
declare const my: Record<string, unknown>

const providerStore: ProviderStore = __PLATFORM__ === 'alipay' || __PLATFORM__ === 'tiniapp' ? my : Object.create(null)

const genLifetimes = (component2 = false): Lifetimes => ({
  page: ['onLoad', 'onUnload'],
  component:
    __PLATFORM__ === 'alipay' || __PLATFORM__ === 'tiniapp'
      ? [component2 ? 'onInit' : 'didMount', 'didUnmount']
      : ['attached', 'detached'],
})

export function setProvider(provider: Provider): void {
  if (!isPlainObject(provider)) {
    warn('provider must be an Object')
  }

  const { store, namespace = '', component2 = false } = provider
  if (
    !store ||
    !isFunction(store.getState) ||
    !isFunction(store.dispatch) ||
    !isFunction(store.subscribe)
  ) {
    warn('store must be a Redux Store instance')
  }

  providerStore.__REDUX_BINDINGS_PROVIDER__ = {
    store,
    lifetimes: genLifetimes(component2),
    namespace,
  }
}

export function getProvider(): ReduxBindingsProvider {
  if (!providerStore.__REDUX_BINDINGS_PROVIDER__) {
    warn('Please setup provider first')
  }

  return providerStore.__REDUX_BINDINGS_PROVIDER__!
}
