import { Unsubscribe } from 'redux'
import { ConnectOption, PageComponentOption, IAnyObject, IAnyArray } from '../types'
import { getProvider } from '../provider'
import handleMapState from './mapState'
import handleMapDispatch from './mapDispatch'
import diff from '../extend/diff'
import subscription from '../extend/subscription'
import { getKeys, warn } from '../utils'

declare const Page: (options: PageComponentOption) => void
declare const Component: (options: PageComponentOption) => void

const INSTANCE_ID = Symbol('INSTANCE_ID')

interface This extends PageComponentOption {
  [INSTANCE_ID]: symbol
}

export default function connect({
  type = 'page',
  mapState,
  mapDispatch,
  manual = false,
}: ConnectOption = {}): (options: PageComponentOption) => void | PageComponentOption {
  if (type !== 'page' && type !== 'component') {
    warn('The type attribute can only be "page" or "component"')
  }

  const isPage = type === 'page'
  const { lifetimes, namespace } = getProvider()

  return function processOption(options: PageComponentOption): PageComponentOption | void {
    if (Array.isArray(mapState) && mapState.length > 0) {
      // Mix the initial value of the dependent state into options.data
      const ownState = handleMapState(mapState)
      options.data = Object.assign(
        options.data || {},
        namespace ? { [namespace]: ownState } : ownState,
      )

      /**
       * The same component can be used multiple times in the same page to generate their own unsubscribe
       * The same page can also exist in multiple instances in the page stack at the same time, generating their own unsubscribe
       * Use Map to collect the unsubscribe of all pages (components), and call the corresponding unsubscribe when it is destroyed
       */
      const unsubscribeMap = new Map<symbol, Unsubscribe>()

      const [onLoadKey, onUnloadKey] = lifetimes[type]
      const oldOnLoad = <Function | undefined>options[onLoadKey]
      const oldOnUnload = <Function | undefined>options[onUnloadKey]

      options[onLoadKey] = function (this: This, ...args: IAnyArray): void {
        const getData = (): IAnyObject =>
          namespace ? <IAnyObject>this.data![namespace] : this.data!

        // Inject the latest value of the dependent state
        const ownState = handleMapState(mapState)
        const diffData = diff(ownState, getData(), namespace)
        if (getKeys(diffData).length > 0) {
          this.setData(diffData)
        }

        // monitor changes in dependent state
        const id = Symbol('instanceId')
        const unsubscribe = subscription(
          { id, data: getData(), setData: this.setData.bind(this) },
          mapState,
        )
        unsubscribeMap.set(id, unsubscribe)
        this[INSTANCE_ID] = id

        if (oldOnLoad) {
          oldOnLoad.apply(this, args)
        }
      }

      options[onUnloadKey] = function (this: This): void {
        if (oldOnUnload) {
          oldOnUnload.apply(this)
        }

        // Cancel listening
        const id = this[INSTANCE_ID]
        if (unsubscribeMap.has(id)) {
          const unsubscribe = unsubscribeMap.get(id)!
          unsubscribeMap.delete(id)
          unsubscribe()
        }
      }
    }

    if (mapDispatch) {
      const target = isPage ? options : (options.methods = options.methods || {})
      handleMapDispatch(mapDispatch, target)
    }

    return manual ? options : isPage ? Page(options) : Component(options)
  }
}

export function $page(
  config: ConnectOption = {},
): (options: PageComponentOption) => void | PageComponentOption {
  config.type = 'page'
  return connect(config)
}

export function $component(
  config: ConnectOption = {},
): (options: PageComponentOption) => void | PageComponentOption {
  config.type = 'component'
  return connect(config)
}
