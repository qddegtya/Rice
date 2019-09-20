import Rice from '@arice/core'
import { internal } from 'xajs'
import { NOOP, DEFAULT_APP_OPTIONS } from './constants'

const bootstrap = ({
  framework = {},
  apps = {},
  viewEngine = {},
  plugins = [],
  beforeBootstrap = NOOP,
  afterBootstrap = NOOP
}) => async appName => {
  const rf = new Rice.Framework(framework)

  for (const k in viewEngine) {
    const ve = viewEngine[k]
    if (!ve.isRiceView) throw new Error(`viewEngine: ${k} is not a valid rice view engine.`)
    rf.defineView(k, ve)
  }

  if (appName in apps) {
    let { bundle: bundlePromise, options = DEFAULT_APP_OPTIONS, sideEffects = NOOP } = apps[
      appName
    ]

    let getBundle = () => null

    if (internal.is.isFunction(bundlePromise)) {
      getBundle = () => bundlePromise().then(mod => mod.default)
    }

    const app = await getBundle()

    if (!app) {
      throw new Error(`Bundle of [${appName}] load failed, please check.`)
    }

    await beforeBootstrap(rf)

    const { mountNode = null, props = {} } = options

    // load app
    await rf.loadApp(app, mountNode, props, plugins)
    
    // setup sideEffects
    await sideEffects(rf.$app, rf.$effectCenter.$effect)

    await afterBootstrap(rf)
  } else {
    throw new Error(`Can not find this app: ${appName}.`)
  }
}

export default bootstrap