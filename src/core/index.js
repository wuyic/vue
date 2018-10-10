// 导入核心
import Vue from './instance/index'
// 部分全局api
import { initGlobalAPI } from './global-api/index'

import { isServerRendering } from 'core/util/env'
// 初始化全局变量
initGlobalAPI(Vue)
// Vue原型定义属性$isServer
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})
// 为Vue原型定义属性$ssrContext
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

Vue.version = '__VERSION__'

export default Vue
