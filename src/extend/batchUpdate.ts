import { QueueItem, Context, IAnyObject } from '../types'
import { getProvider } from '../provider'
import diff from './diff'
import { getKeys } from '../utils'

const queue: QueueItem[] = []

export function batchUpdate({ id, data, setData }: Context, updater: IAnyObject): void {
  const queueItem = queue.find((q) => q.id === id)
  if (queueItem) {
    // Merge multiple updates
    Object.assign(queueItem.updater, updater)
  } else {
    /**
      * A shallow copy of the initial value is stored as the original comparison object when the subsequent diff is executed
      * Mainly to prevent the reference type data from being modified by a page (component) by executing setData, and the diff result of the remaining page (component) is wrong.
      */
    queue.push({ id, rootPath: getProvider().namespace, data: { ...data }, updater, setData })
  }

  // Update data synchronously
  Object.assign(data, updater)
  // Update the view asynchronously
  Promise.resolve().then(update)
}

function update(): void {
  if (queue.length < 1) return

  let queueItem
  while ((queueItem = queue.shift())) {
    const diffData = diff(queueItem.updater, queueItem.data, queueItem.rootPath)
    if (getKeys(diffData).length > 0) {
      queueItem.setData(diffData)
    }
  }
}
