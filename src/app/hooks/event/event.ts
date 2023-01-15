import { EVENT_TYPES } from './constant'

export type CallBack = (...args: any) => any

const im = new Map()

function wrapInvoke(functionDeclaration: CallBack) {
  return (type: symbol, cb: CallBack) => {
    if (!Object.values(EVENT_TYPES).includes(type)) {
      console.warn(`Type(${String(type)}) not registered`)
      return false
    }
    try {
      return functionDeclaration(type, cb)
    } catch (_) {
      console.error(_)
    }
  }
}

async function _emit(type: symbol, payload: any) {
  const targets = im.get(type)
  const result = []
  if (targets) {
    for (const target of targets) {
      const cb = target
      if (typeof cb === 'function') {
        let r = cb(payload)
        if (r && r.then && typeof r.then === 'function') {
          r = await r
        }
        result.push(r)
      }
      if (target.once) {
        targets.delete(target)
      }
    }
  }
  return result
}

function _on(
  type: symbol,
  cb: {
    (): any
    once?: boolean
  }
) {
  let targets = im.get(type)
  if (!targets) {
    im.set(type, (targets = new Set()))
  }
  cb.once = false
  targets.add(cb)
}

function _once(
  type: symbol,
  cb: {
    (): any
    once?: boolean
  }
) {
  let targets = im.get(type)
  if (!targets) {
    im.set(type, (targets = new Set()))
  }
  cb.once = true
  targets.add(cb)
}

function _off(type: symbol, cb: CallBack) {
  const targets = im.get(type)
  if (targets) {
    if (cb) {
      const target = targets.has(cb)
      if (target) {
        targets.delete(cb)
      }
    } else {
      im.delete(type)
    }
  }
}

export const emit = wrapInvoke(_emit)
export const on = wrapInvoke(_on)
export const off = wrapInvoke(_off)
export const once = wrapInvoke(_once)
