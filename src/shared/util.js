/* @flow */
/**
 * 该文件主要是一些公共的小组件
 * @type {Object}
 */

export const emptyObject = Object.freeze({})

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}

export function isTrue (v: any): boolean %checks {
  return v === true
}

export function isFalse (v: any): boolean %checks {
  return v === false
}

/**
 * Check if value is primitive
 * 检测是否是原始类型
 */
export function isPrimitive (value: any): boolean %checks {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * 检测value是否为object
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

/**
 * 获取原始类型 比如 Function Object Array
 * toString是Object的原型属性，call是吧value当为this并执行toString函数
 * 例如 function print() {return this.length;} print.call('123') //输出结果为 3
 * Get the raw type string of a value e.g. [object Object]
 */
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
  return _toString.call(value).slice(8, -1)
}

/**
 * 检测是否是严格的对象
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}

/**
 * 检测是否是正则表达式
 * @param v
 * @returns {boolean}
 */
export function isRegExp (v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * 检测value是否为合法的数组下标
 * isFinite 判定一个数字是否是有限数字
 * Check if val is a valid array index.
 */
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * 将value转化为字符串
 * JSON.stringify 有三个参数
 *  第一个是需要转化的对象
 *  第二个是 用于转换结果的函数或数组
 *  第三个是 文本缩进 2代表缩进两个空格，也可以为字符串
 * Convert a value to a string that is actually rendered.
 */
export function toString (val: any): string {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * 将字符串转化为数字，如果转化失败，则返回源字符串
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * 创建一个map并检测一个key是否在这个Map中 str是创建map的源字符串，通过','来分隔
 * 这是flow语法看起来比较复杂，可以使用babel转码
    function makeMap(str, expectsLowerCase) {
	var map = Object.create(null);
	var list = str.split(',');
	for (var i = 0; i < list.length; i++) {
		map[list[i]] = true;
	}
	return expectsLowerCase ? function (val) {
		return map[val.toLowerCase()];
	} : function (val) {
		return map[val];
	};
}
 * Make a map and return a function for checking if a key
 * is in that map.
 */
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * 使用上面的makeMap方法制作 isBuiltInTag
 * Check if a tag is a built-in tag.
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * 使用上面的makeMap方法制作 isReservedAttribute
 * Check if a attribute is a reserved attribute.
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * 从数组中移除一个元素，若有重复的元素只能移除第一个
 * Remove an item from an array
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 检测一个对象是否拥有某一个自身的属性 hasOwnProperty只会在对象本身查找
 *
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * 自定一个缓存版本 如果有这个缓存版本就取出，否则插入
 * function cached(fn) {
      var cache = Object.create(null);
      return function cachedFn(str) {
        var hit = cache[str];
       return hit || (cache[str] = fn(str));
  };
}
 * Create a cached version of a pure function.
 */
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}

/**
 * 匹配一个单字字符（字母、数字或者下划线）。 并将其转化为大写字母， 然后缓存其值
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * 将字符串的首字母转化为大写
 * Capitalize a string.
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * 将单词中的字母转化为小写 \B 匹配一个单词的边界 = \B的前后 都是“字”字符或者都不是“字”字符
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

function nativeBind (fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}

export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind

/**
 * 将对象数组转化为数组
 * Convert an Array-like object to a real Array.
 */
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * 对象合并，原有则覆盖
 * Mix properties into target object.
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * 将包含对象的数组转化为对象
 * Merge an Array of Objects into a single Object.
 */
export function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/**
 * 空函数
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
export function noop (a?: any, b?: any, c?: any) {}

/**
 * 总是返回false
 * Always return false.
 */
export const no = (a?: any, b?: any, c?: any) => false

/**
 * 返回本身
 * Return same value
 */
export const identity = (_: any) => _

/**
 * 获取 module中staticKeys组成的字符串
 * reduce 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
 * reduce array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
 * Generate a static keys string from compiler modules.
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string {
  return modules.reduce((keys, m) => {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * 检测两个值是否在宽松相等
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * 返回val在数组中宽松相等的第一次出现下标
 */
export function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

/**
 * 确保某个函数只被调用一次
 * Ensure a function is called only once.
 */
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
