import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { inject } from '@arice/di'

const isFn = val => typeof val === "function"

const Eva = ({ effects, autoRun = true }) => {
  let observables = {}

  const setup = () => {
    effects({
      $: (type, $filter) => {
        if (!observables[type]) {
          observables[type] = new Subject()
        }
        if (isFn($filter)) {
          return observables[type].pipe(filter($filter))
        }
        return observables[type]
      },
      inject: inject.singleton
    })
  }

  if (autoRun) setup()

  return {
    setup,
    dispatch: (type, ...args) => {
      if (observables[type]) {
        observables[type].next(...args)
      }
    }
  }
}

export const createEffects = fn => fn

export default Eva
