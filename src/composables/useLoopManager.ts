import { useRenderLoop } from '@tresjs/core'

type Updater = (delta: number) => void

const updaters = new Set<Updater>()

let initialized = false

export function useLoopManager() {
  const { onLoop } = useRenderLoop()

  if (!initialized) {
    initialized = true

    onLoop(({ delta }) => {
      updaters.forEach(fn => fn(delta))
    })
  }

  function add(fn: Updater) {
    // console.log('ADD FN REF:', fn)
    // console.log('exists?', Array.from(updaters).includes(fn))
    updaters.add(fn)

    // console.log('size:', updaters.size)
  }

  function remove(fn: Updater) {
    updaters.delete(fn)
  }

  return { add, remove }
}
