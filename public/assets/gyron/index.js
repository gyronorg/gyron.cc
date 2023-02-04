var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../runtime/src/index.ts
var src_exports = {};
__export(src_exports, {
  Comment: () => Comment,
  Element: () => Element,
  ErrorBoundary: () => ErrorBoundary,
  FC: () => FC,
  FCA: () => FCA,
  Fragment: () => Fragment,
  Text: () => Text,
  Transition: () => Transition,
  asyncTrackEffect: () => asyncTrackEffect,
  cleanupTrackEffect: () => cleanupTrackEffect,
  clearCacheComponent: () => clearCacheComponent,
  clearTrackEffect: () => clearTrackEffect,
  cloneVNode: () => cloneVNode,
  createComponentInstance: () => createComponentInstance,
  createContext: () => createContext,
  createInstance: () => createInstance,
  createRef: () => createRef,
  createSSRContext: () => createSSRContext,
  createSSRInstance: () => createSSRInstance,
  createVNode: () => createVNode,
  createVNodeComment: () => createVNodeComment,
  defineProps: () => defineProps,
  enableTrack: () => enableTrack,
  error: () => error,
  exposeComponent: () => exposeComponent,
  forceUpdate: () => forceUpdate,
  getCurrentComponent: () => getCurrentComponent,
  getPlugins: () => getPlugins,
  h: () => h,
  hydrate: () => hydrate,
  inject: () => inject,
  isResponsive: () => isResponsive,
  isVNode: () => isVNode,
  isVNodeComment: () => isVNodeComment,
  isVNodeComponent: () => isVNodeComponent,
  isVNodeElement: () => isVNodeElement,
  isVNodeFragment: () => isVNodeFragment,
  isVNodeText: () => isVNodeText,
  keepComponent: () => keepComponent,
  manualErrorHandler: () => manualErrorHandler,
  manualWarnHandler: () => manualWarnHandler,
  mergeVNode: () => mergeVNode,
  nextRender: () => nextRender,
  normalizeChildrenVNode: () => normalizeChildrenVNode,
  normalizeVNode: () => normalizeVNode,
  normalizeVNodeWithLink: () => normalizeVNodeWithLink,
  onAfterMount: () => onAfterMount,
  onAfterUpdate: () => onAfterUpdate,
  onBeforeMount: () => onBeforeMount,
  onBeforeUpdate: () => onBeforeUpdate,
  onDestroyed: () => onDestroyed,
  pauseTrack: () => pauseTrack,
  provide: () => provide,
  registerErrorHandler: () => registerErrorHandler,
  registerWarnHandler: () => registerWarnHandler,
  removeBuiltInProps: () => removeBuiltInProps,
  render: () => render,
  renderComponent: () => renderComponent,
  rerender: () => rerender,
  toRaw: () => toRaw,
  useAccrued: () => useAccrued,
  useComponentContext: () => useComponentContext,
  useComputed: () => useComputed,
  useDeferred: () => useDeferred,
  useEffect: () => useEffect,
  useInject: () => useInject,
  useMemo: () => useMemo,
  useProvide: () => useProvide,
  useReactive: () => useReactive,
  useValue: () => useValue,
  useWatch: () => useWatch,
  warn: () => warn
});

// ../shared/src/index.ts
function keys(o) {
  return isObject(o) ? Object.keys(o) : [];
}
function isUndefined(o) {
  return typeof o === "undefined";
}
function isNull(o) {
  return typeof o === "object" && !o;
}
function isArray(o) {
  return Array.isArray(o);
}
function isSet(val) {
  return Object.prototype.toString.call(val) === "[object Set]";
}
function isMap(val) {
  return Object.prototype.toString.call(val) === "[object Map]";
}
function isCollection(val) {
  const type = Object.prototype.toString.call(val).slice(8, -1);
  return ["Map", "Set", "WeakMap", "WeakSet"].includes(type);
}
function isBoolean(o) {
  return Object.prototype.toString.call(o) === "[object Boolean]";
}
function isObjectPrototype(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isIntegerKey(key) {
  return isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
}
function shouldValue(o) {
  if (isArray(o)) {
    return o.length > 0;
  }
  return typeof o !== "undefined" && o !== null;
}
function extend(...args) {
  return Object.assign(args[0], ...args.slice(1));
}
function isObject(o) {
  return o && typeof o === "object";
}
function noop() {
}
function isElement(o) {
  return o instanceof Node;
}
function isComment(node) {
  return node.nodeType === 8;
}
function isPromise(f) {
  return isObject(f) && isFunction(f.then) && isFunction(f.catch);
}
function isString(o) {
  return typeof o === "string";
}
function isNumber(o) {
  return typeof o === "number";
}
function isPlanObject(obj) {
  if (!isObjectPrototype(obj))
    return false;
  const ctor = obj.constructor;
  if (!isFunction(ctor))
    return false;
  const prot = ctor.prototype;
  if (!isObjectPrototype(prot))
    return false;
  if (hasOwn(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function isFunction(o) {
  return o && typeof o === "function";
}
function hasOwn(val, key) {
  return Object.prototype.hasOwnProperty.call(val, key);
}
function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}
function defineWritable(obj, k, readonly) {
  Object.defineProperty(obj, k, {
    configurable: true,
    writable: !readonly
  });
}
function objectReadonlyReducer(obj, readonly) {
  for (const k in obj) {
    if (hasOwn(obj, k)) {
      const { configurable } = Object.getOwnPropertyDescriptor(obj, k);
      if (configurable) {
        const value = obj[k];
        defineWritable(obj, k, readonly);
        if (isPlanObject(value)) {
          objectReadonlyReducer(value, readonly);
        }
      }
    }
  }
}
function isReadonly(obj, k) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, k);
  if (descriptor) {
    return !descriptor.writable;
  }
  return false;
}
function isEqual(target, source, k) {
  if (keys(target).length !== keys(source).length) {
    return false;
  }
  for (const key in target) {
    if (key !== k) {
      const p1 = target[key];
      const p2 = source[key];
      if (isArray(p1) && isArray(p2)) {
        if (p1.length !== p2.length) {
          return false;
        }
        for (let i = 0, len = p1.length; i < len; i++) {
          if (isObject(p1[i]) && isObject(p2[i])) {
            if (isEqual(p1[i], p2[i], k)) {
              return false;
            }
          } else if (p1[i] !== p2[i]) {
            return false;
          }
        }
        return true;
      } else if (target[key] !== source[key]) {
        return false;
      }
    }
  }
  return true;
}
function omit(o, k) {
  const target = {};
  for (const key in o) {
    if (isArray(k)) {
      if (!k.includes(key)) {
        target[key] = o[key];
      }
    } else {
      if (k !== key) {
        target[key] = o[key];
      }
    }
  }
  return target;
}
function merge(target, source) {
  if (shouldValue(source)) {
    if (isArray(target)) {
      if (isArray(source)) {
        target.push(...source);
      } else {
        target.push(source);
      }
    } else if (isPlanObject(target)) {
      extend(target, source || {});
    } else if (isUndefined(target) || isNull(target)) {
      target = source;
    }
  }
  return target;
}
function diffWord(words, newWords) {
  const kindDeleteWords = [];
  const kindAddWords = [];
  words.filter(Boolean).forEach((word) => {
    if (!newWords.includes(word)) {
      kindDeleteWords.push(word);
    }
  });
  newWords.filter(Boolean).forEach((word) => {
    if (!words.includes(word)) {
      kindAddWords.push(word);
    }
  });
  return {
    D: kindDeleteWords,
    A: kindAddWords
  };
}
function isEventProps(name) {
  return /^on[A-Z]/.test(name);
}
function normalizeEventName(name) {
  return name.slice(2).toLocaleLowerCase();
}
function initialLifecycle(component, key) {
  if (!component.lifecycle) {
    component.lifecycle = {
      [key]: /* @__PURE__ */ new Set()
    };
  }
  if (!component.lifecycle[key]) {
    component.lifecycle[key] = /* @__PURE__ */ new Set();
  }
}

// ../reactivity/src/effect.ts
var activeEffect;
var effectTracks = /* @__PURE__ */ new WeakMap();
var ITERATE_KEY = Symbol.for("gyron.iterate");
var MAP_KEY_ITERATE_KEY = Symbol.for("gyron.map-iterate");
var shouldTrack = true;
function pauseTrack() {
  shouldTrack = false;
}
function enableTrack() {
  shouldTrack = true;
}
function asyncTrackEffect(effect) {
  activeEffect = effect;
}
function clearTrackEffect() {
  activeEffect = void 0;
}
function createEffect(fn, scheduler = null, dependency = []) {
  let prevActiveEffect = null;
  const effect = {
    deps: [],
    allowEffect: null,
    scheduler,
    run: () => {
      try {
        prevActiveEffect = activeEffect;
        activeEffect = effect;
        effect.wrapper();
        return fn();
      } finally {
        activeEffect = prevActiveEffect;
        prevActiveEffect = null;
      }
    },
    stop: () => {
      const { deps } = effect;
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].delete(effect);
        }
        deps.length = 0;
      }
    },
    wrapper: () => {
      for (let i = 0; i < dependency.length; i++) {
        const fn2 = dependency[i];
        fn2();
      }
    }
  };
  return effect;
}
function useEffect(fn, dependency) {
  const effect = createEffect(fn, null, dependency);
  effect.run();
  const runner = effect.run.bind(effect);
  runner.effect = effect;
  return runner;
}
function track(target, key, type) {
  if (shouldTrack && activeEffect) {
    let targetTracks = effectTracks.get(target);
    if (!targetTracks) {
      effectTracks.set(target, targetTracks = /* @__PURE__ */ new Map());
    }
    let targetDep = targetTracks.get(key);
    if (!targetDep) {
      targetTracks.set(key, targetDep = /* @__PURE__ */ new Set());
    }
    trackEffect(targetDep);
  }
}
function trackEffect(dep2) {
  if (activeEffect && !dep2.has(activeEffect)) {
    dep2.add(activeEffect);
    activeEffect.deps.push(dep2);
  }
}
function cleanupTrackEffect(target, key) {
  const depsMap = effectTracks.get(
    target["_primitive_" /* IS_PRIMITIVE */] ? target["_raw_value_" /* RAW_VALUE */] : target["_raw_" /* RAW */]
  );
  if (depsMap) {
    const deps = depsMap.get(key);
    if (deps) {
      deps.clear();
    }
  }
}
function trigger(target, key, type, value) {
  const targetTracks = effectTracks.get(target);
  if (targetTracks) {
    const deps = [];
    if (key === "length" && isArray(target)) {
      targetTracks.forEach((dep2, key2) => {
        if (key2 === "length") {
          deps.push(dep2);
        }
      });
    } else {
      deps.push(targetTracks.get(key));
      switch (type) {
        case "add" /* ADD */:
          if (!isArray(target)) {
            deps.push(targetTracks.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(targetTracks.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            deps.push(targetTracks.get("length"));
          }
          break;
        case "delete" /* DELETE */:
          if (!isArray(target)) {
            deps.push(targetTracks.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(targetTracks.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set" /* SET */:
          if (isMap(target)) {
            deps.push(targetTracks.get(ITERATE_KEY));
          }
          break;
      }
    }
    if (deps.length === 1) {
      if (deps[0]) {
        triggerEffect(deps[0]);
      }
    } else {
      const effects = [];
      for (const dep2 of deps) {
        if (dep2) {
          effects.push(...dep2);
        }
      }
      triggerEffect(new Set(effects));
    }
  }
}
function triggerEffect(dep2) {
  const deps = isArray(dep2) ? dep2 : [...dep2];
  for (const effect of deps) {
    if (effect !== activeEffect || effect.allowEffect) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
}

// ../reactivity/src/collection.ts
var getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key) {
  target = target["_raw_" /* RAW */];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    track(rawTarget, key, "get" /* GET */);
  }
  track(rawTarget, rawKey, "get" /* GET */);
  const { has: has3 } = getProto(rawTarget);
  if (has3.call(rawTarget, key)) {
    return target.get(key);
  } else if (has3.call(rawTarget, rawKey)) {
    return target.get(rawKey);
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, value, "add" /* ADD */);
  }
  return this;
}
function has(key) {
  const target = this["_raw_" /* RAW */];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    track(rawTarget, key, "has" /* HAS */);
  }
  track(rawTarget, rawKey, "has" /* HAS */);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target) {
  target = target["_raw_" /* RAW */];
  track(toRaw(target), ITERATE_KEY, "iterate" /* ITERATE */);
  return Reflect.get(target, "size", target);
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has3, get: get3 } = getProto(target);
  let hadKey = has3.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has3.call(target, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, key, "add" /* ADD */, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, key, "set" /* SET */, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has3 } = getProto(target);
  let hadKey = has3.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has3.call(target, key);
  }
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, key, "delete" /* DELETE */);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, void 0, "clear" /* CLEAR */);
  }
  return result;
}
function createForEach() {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["_raw_" /* RAW */];
    const rawTarget = toRaw(target);
    track(rawTarget, ITERATE_KEY, "iterate" /* ITERATE */);
    return target.forEach((value, key) => {
      return callback.call(thisArg, value, key, observed);
    });
  };
}
function createIterableMethod(method) {
  return function(...args) {
    const target = this["_raw_" /* RAW */];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    track(
      rawTarget,
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY,
      "iterate" /* ITERATE */
    );
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [value[0], value[1]] : value,
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
var collectionHandlers = {
  get: (target, key, receiver) => {
    const collections = {
      get size() {
        return size(this);
      },
      get(key2) {
        return get(this, key2);
      },
      has,
      add,
      set,
      delete: deleteEntry,
      clear,
      forEach: createForEach(),
      keys: createIterableMethod("keys"),
      values: createIterableMethod("values"),
      entries: createIterableMethod("entries"),
      [Symbol.iterator]: createIterableMethod(Symbol.iterator)
    };
    if (key === "_raw_" /* RAW */) {
      return target;
    }
    return Reflect.get(
      hasOwn(collections, key) && key in target ? collections : target,
      key,
      receiver
    );
  }
};

// ../reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function isResponsive(n) {
  return isObject(n) && Boolean(
    n["_reactive_" /* IS_REACTIVE */] || n["_computed_" /* IS_COMPUTED */] || n["_primitive_" /* IS_PRIMITIVE */]
  );
}
function toRaw(observed) {
  const raw = !isUndefined(observed) && observed["_raw_" /* RAW */];
  if (!isUndefined(raw)) {
    return toRaw(raw);
  }
  return observed;
}
var arrayInstrumentations = createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, i + "", "get" /* GET */);
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTrack();
      const res = this["_raw_" /* RAW */][key].apply(this, args);
      enableTrack();
      return res;
    };
  });
  return instrumentations;
}
function get2(target, key, receiver) {
  if (key === "_reactive_" /* IS_REACTIVE */) {
    return true;
  }
  if (key === "_raw_" /* RAW */) {
    return target;
  }
  const targetIsArray = Array.isArray(target);
  if (targetIsArray) {
    if (hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
  }
  const res = Reflect.get(target, key, receiver);
  track(target, key, "get" /* GET */);
  if (res && typeof res === "object" && !isResponsive(res)) {
    return useReactive(res);
  }
  return res;
}
function set2(target, key, value, receiver) {
  if (isReadonly(target, key)) {
    return false;
  }
  const oldValue = target[key];
  const res = Reflect.set(target, key, value, receiver);
  if (hasChanged(oldValue, value) || isArray(target)) {
    trigger(target, key, "add" /* ADD */);
  }
  return res;
}
function has2(target, key) {
  const res = Reflect.has(target, key);
  track(target, key, "has" /* HAS */);
  return res;
}
function deleteProperty(target, key) {
  if (isReadonly(target, key)) {
    return false;
  }
  trigger(target, key, "delete" /* DELETE */);
  return Reflect.deleteProperty(target, key);
}
function ownKeys(target) {
  const res = Reflect.ownKeys(target);
  track(target, isArray(target) ? "length" : ITERATE_KEY, "iterate" /* ITERATE */);
  return res;
}
var mutableHandlers = {
  get: get2,
  set: set2,
  has: has2,
  deleteProperty,
  ownKeys
};
function useReactive(target, readonly) {
  const existingProxy = reactiveMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  if (readonly) {
    objectReadonlyReducer(target, readonly);
  }
  const proxy = new Proxy(
    target,
    isCollection(target) ? collectionHandlers : mutableHandlers
  );
  reactiveMap.set(target, proxy);
  return proxy;
}

// ../reactivity/src/computed.ts
var Computed = class {
  constructor(getter, setter, dependency = [], memo = false) {
    this.getter = getter;
    this.setter = setter;
    this.dependency = dependency;
    this.memo = memo;
    this._effect = createEffect(
      this.getter,
      () => {
        if (this.memo) {
          if (!this._lazy) {
            this._lazy = true;
            triggerEffect(this.dep);
          }
        } else {
          triggerEffect(this.dep);
        }
      },
      this.dependency
    );
  }
  _effect;
  _value;
  _lazy = true;
  dep;
  ["_computed_" /* IS_COMPUTED */] = true;
  get value() {
    trackEffect(this.dep || (this.dep = /* @__PURE__ */ new Set()));
    if (this.memo) {
      if (this._lazy) {
        this._lazy = false;
        this._value = this._effect.run();
      }
    } else {
      this._value = this._effect.run();
    }
    return this._value;
  }
  set value(v) {
    this.setter(v);
  }
  get ["_raw_" /* RAW */]() {
    try {
      pauseTrack();
      return this._effect.run();
    } finally {
      enableTrack();
    }
  }
};
function wrapperComputed(getter, unstable, dependency, memo) {
  let setter;
  if (isFunction(unstable)) {
    setter = unstable;
  } else if (isUndefined(unstable)) {
    setter = noop;
  } else if (isArray(unstable)) {
    dependency = unstable;
    setter = noop;
  }
  return new Computed(getter, setter, dependency, memo);
}
function useComputed(getter, unstable, dependency) {
  return wrapperComputed(getter, unstable, dependency, false);
}
function useMemo(getter, unstable, dependency) {
  return wrapperComputed(getter, unstable, dependency, true);
}

// ../reactivity/src/primitive.ts
var Primitive = class {
  _value;
  ["_primitive_" /* IS_PRIMITIVE */] = true;
  constructor(value) {
    this._value = useReactive({
      value
    });
  }
  get value() {
    return this._value.value;
  }
  set value(v) {
    this._value.value = v;
  }
  get ["_raw_" /* RAW */]() {
    return toRaw(this._value.value);
  }
  get ["_raw_value_" /* RAW_VALUE */]() {
    return toRaw(this._value);
  }
};
function useValue(value) {
  return new Primitive(value);
}

// ../dom-client/src/opt.ts
var NS = "http://www.w3.org/2000/svg";
function insert(child, parent, anchor) {
  if (anchor && parent.contains(anchor)) {
    parent.insertBefore(child, anchor);
  } else {
    append(child, parent);
  }
}
function append(child, parent) {
  parent.appendChild(child);
}
function remove(child) {
  child.remove();
}
function createElement(tag, isSvg, is) {
  const el = isSvg ? document.createElementNS(NS, tag) : document.createElement(tag, is ? { is } : void 0);
  return el;
}
function createText(text) {
  return document.createTextNode(text);
}
function createComment(data) {
  return document.createComment(data || "");
}
function nextSibling(node) {
  let nextNode = node.nextSibling;
  while (nextNode && isComment(nextNode) && nextNode.data === "|") {
    nextNode = nextNode.nextSibling;
  }
  return nextNode;
}
function querySelector(selector, container) {
  return (container || document).querySelector(selector);
}

// ../dom-client/src/controlled.ts
function setSelectValue(el, value) {
  const isMultiple = el.multiple;
  if (isMultiple && !isArray(value) && !isSet(value)) {
    console.warn(
      "There is a multiple attribute in select, so the value of the value attribute must be an array"
    );
    return null;
  }
  for (let i = 0; i < el.options.length; i++) {
    const option = el.options[i];
    const optionValue = option.value;
    if (isMultiple) {
      if (isArray(value)) {
        option.selected = value.includes(optionValue);
      } else {
        option.selected = value.has(optionValue);
      }
    } else {
      if (optionValue === value) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return;
      }
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
}
function getComponentByVNode(vnode) {
  let parent = vnode;
  while (parent && !parent.component) {
    parent = parent.parent;
  }
  if (!parent) {
    console.warn(
      "No vnode found in the vnode chain containing component attributes",
      vnode
    );
    return null;
  }
  return parent.component;
}
function selectElementControlled(el, value, vnode) {
  const component = getComponentByVNode(vnode);
  if (component) {
    if (component.mounted) {
      setSelectValue(el, value);
    } else {
      initialLifecycle(component, "afterMounts");
      component.lifecycle.afterMounts.add(
        setSelectValue.bind(null, el, value)
      );
    }
  }
}
function controlledElementValue(el, key, value, vnode) {
  switch (el.nodeName) {
    case "SELECT":
      selectElementControlled(el, value, vnode);
      break;
    default:
      el[key] = value;
  }
}
function isControlledElementProp(el, key) {
  switch (el.nodeName) {
    case "SELECT":
    case "TEXTAREA":
      return key === "value";
    case "INPUT":
      switch (el.type) {
        case "radio":
        case "checkbox":
          return key === "checked";
        default:
          return key === "value";
      }
  }
  return false;
}
function isSelectElement(vnode) {
  return vnode.el && vnode.el.nodeName === "SELECT";
}

// ../dom-client/src/props.ts
function setAttribute(el, key, value, vnode) {
  if (el.nodeName === "SVG") {
    el.setAttributeNS(NS, key, value);
  } else {
    if (isControlledElementProp(el, key)) {
      controlledElementValue(el, key, value, vnode);
    } else {
      if (isBoolean(value)) {
        if (value) {
          el.setAttribute(key, "");
        } else {
          el.removeAttribute(key);
        }
      } else {
        el.setAttribute(key, value);
      }
    }
  }
}
function removeAttribute(el, key) {
  if (el.nodeName === "SVG") {
    el.removeAttributeNS(NS, key);
  } else {
    el.removeAttribute(key);
  }
}
function unmountProps(el, unmounts, props) {
  for (const key of unmounts) {
    if (isEventProps(key)) {
      el.removeEventListener(normalizeEventName(key), props[key]);
    } else {
      removeAttribute(el, key);
    }
  }
}
function patchEvent(el, key, oldEvent, newEvent, debugOption) {
  if (newEvent) {
    if (newEvent !== oldEvent) {
      el.removeEventListener(key, oldEvent);
      el.addEventListener(key, newEvent);
      if (false) {
        debugOption.update("event");
      }
    }
  }
}
function patchClass(el, oldValue, value, debugOption) {
  if (oldValue === value) {
    return;
  }
  const { D, A } = diffWord(
    isString(oldValue) ? oldValue.split(" ") : [],
    isString(value) ? value.split(" ") : []
  );
  el.classList.remove(...D);
  if (!value) {
    removeAttribute(el, "class");
  } else {
    el.classList.add(...A);
  }
  if (false) {
    debugOption.update("class");
  }
}
function patchStyle(el, oldValue, value, vnode, debugOption) {
  if (isString(value)) {
    if (value !== oldValue) {
      setAttribute(el, "style", value, vnode);
    }
  } else {
    if (isObject(value)) {
      for (const [css, cssValue] of Object.entries(value)) {
        if (!oldValue || oldValue[css] !== cssValue) {
          ;
          el.style[css] = cssValue;
          if (false) {
            debugOption.update("style");
          }
        }
      }
      if (isObject(oldValue)) {
        for (const css in oldValue) {
          if (!value[css]) {
            ;
            el.style[css] = null;
          }
        }
      }
    } else {
      removeAttribute(el, "style");
    }
  }
}
function patchProp(el, key, vnode, oldValue, newValue, debugOption) {
  if (isEventProps(key)) {
    patchEvent(el, normalizeEventName(key), oldValue, newValue, debugOption);
  } else if (key === "style") {
    patchStyle(el, oldValue, newValue, vnode, debugOption);
  } else if (key === "class" || key === "className") {
    patchClass(el, oldValue, newValue, debugOption);
  } else if (key === "html") {
    if (shouldValue(vnode.children)) {
      console.warn(
        "Both the html attribute and the child node exist in the node.\n",
        vnode
      );
    } else {
      el.innerHTML = newValue;
    }
  } else {
    try {
      setAttribute(el, key, newValue, vnode);
    } catch (e) {
      console.warn(e);
    }
  }
}
function mountProps(el, vnode) {
  for (const key in vnode.props) {
    patchProp(el, key, vnode, null, vnode.props[key]);
  }
}
function patchProps(el, n1, n2) {
  const unmounts = [];
  for (const key in n2.props) {
    unmounts.push(key);
    const oldValue = n1.props?.[key];
    const newValue = n2.props?.[key];
    patchProp(el, key, n2, oldValue, newValue);
  }
  if (n1.props) {
    unmountProps(
      el,
      keys(n1.props).filter((key) => !unmounts.includes(key)),
      n1.props
    );
  }
}

// ../runtime/src/shared.ts
function isVNode(n) {
  return n && n.flag === Gyron;
}
function isVNodeElement(n) {
  return n.type === Element;
}
function isVNodeText(n) {
  return n.type === Text;
}
function isVNodeComment(n) {
  return n.type === Comment;
}
function isVNodeFragment(n) {
  return n.type === Fragment;
}
function isVNodeComponent(n) {
  return isVNode(n) && isFunction(n.type) && n.nodeType === -1 /* Component */;
}
function getUserContainer(containerOrSelector) {
  if (isString(containerOrSelector)) {
    return querySelector(containerOrSelector);
  } else {
    return containerOrSelector;
  }
}

// ../runtime/src/vnode.ts
var Gyron = Symbol("gyron");
var Text = Symbol("gyron.text");
var Element = Symbol("gyron.element");
var Comment = Symbol("gyron.comment");
var Fragment = Symbol("gyron.fragment");
function cloneVNode(vnode) {
  if (isArray(vnode)) {
    return vnode.map(cloneVNode);
  }
  if (isVNode(vnode)) {
    return extend({}, vnode, {
      flag: Gyron
    });
  }
  return normalizeVNode(vnode);
}
function mergeVNode(vnode, props) {
  if (isArray(vnode)) {
    for (let i = 0; i < vnode.length; i++) {
      const node = normalizeVNode(vnode[i]);
      vnode[i] = node;
      mergeVNode(node, props);
    }
  } else {
    extend(vnode.props, props);
  }
  return vnode;
}
function mergeVNodeWith(n1, n2) {
  if (isVNodeComponent(n1) && isVNodeComponent(n2)) {
    n1.component = n2.component;
  }
  n1.el = n2.el;
  return n1;
}
function createVNode(tag, props, children) {
  let vnodeProps = props ? props : {};
  const key = shouldValue(vnodeProps.key) ? vnodeProps.key : null;
  let type = Text;
  let nodeType = 3 /* Text */;
  let _uri;
  if (isString(tag) && (!isUndefined(props) || !isUndefined(children))) {
    type = Element;
    nodeType = 1 /* Element */;
  } else if (isFunction(tag)) {
    type = tag;
    nodeType = -1 /* Component */;
    vnodeProps = omit(vnodeProps, "key");
    const __ssr_uri = tag.__ssr_uri;
    if (__ssr_uri) {
      _uri = __ssr_uri;
    }
  } else if (isArray(tag)) {
    type = Fragment;
    nodeType = -2 /* Fragment */;
    children = mergeVNode(tag.map(normalizeVNode), vnodeProps);
  } else {
    children = tag;
  }
  if (isArray(children)) {
    children = children.flat(Infinity);
  }
  const vnode = {
    type,
    nodeType,
    key,
    flag: Gyron,
    props: vnodeProps,
    children,
    __uri: _uri
  };
  if (type === Element) {
    vnode.tag = tag;
  }
  return vnode;
}
function createVNodeComment(children) {
  return {
    type: Comment,
    nodeType: 8 /* Comment */,
    props: {},
    flag: Gyron,
    children
  };
}
function normalizeVNode(value) {
  if (isVNode(value)) {
    return value;
  }
  if (value === null || typeof value === "boolean") {
    return createVNodeComment();
  }
  if (Array.isArray(value)) {
    return createVNode(value.slice());
  }
  return createVNode("" + value);
}
function normalizeChildrenVNode(vnode) {
  const parent = vnode;
  if (!parent) {
    console.warn(
      "The parent node was not found when formatting the child node, this will raise a PROVIDE error, please check."
    );
  }
  const children = isArray(vnode.children) ? vnode.children : [vnode.children];
  return children.filter(shouldValue).map((node) => normalizeVNodeWithLink(node, parent));
}
function normalizeVNodeWithLink(children, parent) {
  const node = normalizeVNode(children);
  node.parent = parent;
  return node;
}

// ../runtime/src/lifecycle.ts
function wrapLifecycle(component, type) {
  if (!component.lifecycle || !component.lifecycle[type])
    return;
  const lifecycle = [...component.lifecycle[type]];
  const wrapResult = [];
  for (let i = 0; i < lifecycle.length; i++) {
    const listener = lifecycle[i];
    const params = [];
    if (type === "beforeUpdates" || type === "afterUpdates") {
      params.push(component.prevProps, component.props);
    } else {
      params.push(component);
    }
    const result = callWithErrorHandling(
      listener,
      component,
      "Lifecycle" /* Lifecycle */,
      params
    );
    if (type === "beforeUpdates" && isBoolean(result) && !result) {
      return false;
    }
    wrapResult.push(result);
  }
  return wrapResult;
}
function onBeforeMount(callback) {
  const component = getCurrentComponent();
  initialLifecycle(component, "beforeMounts");
  component.lifecycle.beforeMounts.add(callback);
}
function onAfterMount(callback) {
  const component = getCurrentComponent();
  initialLifecycle(component, "afterMounts");
  component.lifecycle.afterMounts.add(callback);
}
function onDestroyed(callback) {
  const component = getCurrentComponent();
  initialLifecycle(component, "destroyed");
  component.lifecycle.destroyed.add(callback);
}
function onBeforeUpdate(callback) {
  const component = getCurrentComponent();
  initialLifecycle(component, "beforeUpdates");
  component.lifecycle.beforeUpdates.add(callback);
}
function onAfterUpdate(callback) {
  const component = getCurrentComponent();
  initialLifecycle(component, "afterUpdates");
  component.lifecycle.afterUpdates.add(callback);
}
function invokeLifecycle(component, type) {
  switch (type) {
    case "beforeMounts":
    case "afterMounts":
    case "destroyed":
    case "beforeUpdates":
    case "afterUpdates":
      return wrapLifecycle(component, type);
  }
}

// ../runtime/src/boundaries.ts
var ErrorType = Symbol.for("gyron.error-handler");
var WarnType = Symbol.for("gyron.warn-handler");
function registerErrorHandler(handler) {
  const component = getCurrentComponent();
  component.ctx[ErrorType] = handler;
}
function registerWarnHandler(handler) {
  const component = getCurrentComponent();
  component.ctx[WarnType] = handler;
}
function manualHandlerBase(type, error2, component) {
  if (!component) {
    console.warn(
      "No component instance found, you can get { component } on the component parameter"
    );
    return null;
  }
  const componentHandle = component.ctx[type === "Error" ? ErrorType : WarnType];
  const handler = componentHandle || getErrorBoundaryCtx(component);
  if (!handler) {
    console.warn(
      "No ErrorBoundary component was found in the upper level component, please register the ErrorBoundary component and try again."
    );
    return null;
  }
  if (error2 instanceof Error) {
    handler({
      type,
      message: error2.message,
      component,
      stack: error2.stack
    });
  } else {
    handler({ type, message: String(error2), component });
  }
}
function manualErrorHandler(error2, component) {
  return manualHandlerBase("Error", error2, component);
}
function manualWarnHandler(warn3, component) {
  return manualHandlerBase("Warn", warn3, component);
}

// ../runtime/src/assert.ts
function warn(err, component, type) {
  if (component && component.ctx[WarnType]) {
    const errorHandler = component.ctx[WarnType];
    if (err instanceof Error) {
      errorHandler({
        type: "Warn",
        message: err.message,
        component,
        stack: err.stack
      });
    } else {
      errorHandler({
        type: "Warn",
        message: err,
        component,
        stack: null
      });
    }
  } else {
    console.warn(`[${type}]`, err, "\n", component);
  }
}
function error(err, component, type) {
  if (component) {
    let errorHandler;
    if (component.ctx[ErrorType]) {
      errorHandler = component.ctx[ErrorType];
    }
    if (!errorHandler) {
      errorHandler = getErrorBoundaryCtx(component);
    }
    if (errorHandler) {
      errorHandler({
        type: "Error",
        message: err.message,
        component,
        stack: err.stack
      });
      return null;
    }
  }
  console.error(`[${type}]`, err, "\n", component);
}

// ../runtime/src/component.ts
var uid = 0;
var _component;
function createComponentInstance(vnode, parentComponent) {
  const component = {
    uid: uid++,
    type: vnode.type,
    parent: null,
    vnode: null,
    ctx: {},
    mounted: false,
    destroyed: false,
    subTree: null,
    effect: null,
    update: null,
    render: null,
    setup: null,
    props: null,
    prevProps: null,
    lifecycle: null,
    exposed: null,
    $el: null,
    $parent: null
  };
  normalizeComponent(vnode, component, parentComponent);
  return component;
}
function getCurrentComponent() {
  if (!_component) {
    warn(
      "Failed to get component instance, please submit issues to us at https://github.com/gyronorg/core",
      null,
      "getCurrentComponent"
    );
  }
  return _component;
}
function forceUpdate(component) {
  component.update();
}
function renderComponentSubTree(component, props, renderTree) {
  if (isFunction(renderTree)) {
    component.render = renderTree;
    renderTree = callWithErrorHandling(
      renderTree,
      component,
      ErrorHandlingType.Setup,
      [props, component]
    );
  }
  if (isPromise(renderTree)) {
    return renderTree.then((subTree2) => {
      subTree2 = normalizeVNode(subTree2);
      subTree2.parent = component.vnode;
      return subTree2;
    });
  }
  const subTree = normalizeVNode(renderTree);
  subTree.parent = component.vnode;
  return subTree;
}
function renderComponent(component, isSSR = false) {
  const { render: render2, setup } = component;
  const renderFunction = render2 || setup;
  _component = component;
  const props = normalizeComponentProps(component, isSSR);
  const renderTree = callWithErrorHandling(
    renderFunction,
    component,
    render2 ? ErrorHandlingType.Render : ErrorHandlingType.Setup,
    [props, component]
  );
  _component = null;
  if (!component.mounted) {
    invokeLifecycle(component, "beforeMounts");
  }
  return renderComponentSubTree(component, props, renderTree);
}
function defineProps(defaultValue) {
  const component = getCurrentComponent();
  if (isObject(defaultValue)) {
    const props = extend({}, component.props);
    for (const key in defaultValue) {
      if (isUndefined(component.props[key])) {
        props[key] = defaultValue[key];
      }
    }
    return props;
  }
  return component.props;
}
function exposeComponent(exposed) {
  const component = getCurrentComponent();
  extend(component.exposed, exposed);
}
function useWatch(watcher, dependency) {
  const { effect } = useEffect(watcher, dependency);
  onDestroyed(() => effect.stop());
}
function isAsyncComponent(componentFunction) {
  return componentFunction ? isFunction(componentFunction.__loader) : false;
}
function FCA(componentAsyncFunction) {
  let resolveComp;
  let setup;
  let loadedRet = false;
  let __component;
  const state = useReactive({
    loaded: false
  });
  function setComponent(component) {
    _component = __component = component;
  }
  function clearComponent() {
    _component = null;
  }
  const load = (props, component) => {
    setComponent(component);
    return componentAsyncFunction(props).then((value) => {
      loadedRet = true;
      const subtree = value.default || value;
      setComponent(component);
      if (isFunction(subtree)) {
        setup = subtree;
        resolveComp = normalizeVNode(
          subtree(props, component)
        );
      } else {
        resolveComp = normalizeVNode(subtree);
        if (false) {
          console.warn(
            "Async components are recommended to return a function that updates local state.\nIt is different from normal components, normal components are called again, while asynchronous components are called only once"
          );
        }
      }
      clearComponent();
      return resolveComp;
    }).catch((e) => {
      error(e, component, "AsyncComponent");
      return createVNodeComment("AsyncComponentError");
    });
  };
  const ret = function AsyncComponentWrapper() {
    const props = defineProps();
    if (props.isSSR) {
      return load(props, _component);
    }
    if (!loadedRet) {
      load(props, _component).then(() => {
        state.loaded = true;
      });
    } else {
      state.loaded = true;
    }
    exposeComponent({
      state,
      __loader: load
    });
    return function AsyncComponentWrapperSetup() {
      _component = __component;
      return state.loaded && resolveComp ? setup ? setup(props) : cloneVNode(resolveComp) : props.fallback || createVNodeComment("AsyncComponentWrapper");
    };
  };
  ret.__loader = load;
  return ret;
}
function FC(componentFunction) {
  return componentFunction;
}
var cacheMemoComponent = /* @__PURE__ */ new Map();
var cacheIndex = 0;
function getCacheComponent(componentFunction) {
  return cacheMemoComponent.get(componentFunction);
}
function collectCacheComponent(componentFunction, component) {
  cacheMemoComponent.set(componentFunction, component);
}
function isCacheComponent(componentFunction) {
  return cacheMemoComponent.has(componentFunction);
}
function clearCacheComponent(componentFunction) {
  if (isCacheComponent(componentFunction)) {
    const component = cacheMemoComponent.get(componentFunction);
    component.effect.stop();
    cacheMemoComponent.delete(componentFunction);
  }
}
function keepComponent(componentFunction) {
  componentFunction.__cache = true;
  componentFunction.__cacheIndex = cacheIndex++;
  return componentFunction;
}
var ErrorHandlingType = /* @__PURE__ */ ((ErrorHandlingType2) => {
  ErrorHandlingType2["Render"] = "Render";
  ErrorHandlingType2["Setup"] = "Setup";
  ErrorHandlingType2["Lifecycle"] = "Lifecycle";
  ErrorHandlingType2["Scheduler"] = "Scheduler";
  return ErrorHandlingType2;
})(ErrorHandlingType || {});
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    error(err, instance, type);
  }
  return res;
}
function normalizeComponent(vnode, component, parentComponent) {
  const { type } = vnode;
  if (!type) {
    console.warn('Failed to format component, "type" not found. node: ', vnode);
    return;
  }
  let setup;
  if (isFunction(type)) {
    setup = type;
  }
  if (!component.props) {
    component.props = {};
  }
  component.prevProps = extend({}, component.props);
  component.props = extend(component.props, vnode.props, {
    children: vnode.children
  });
  component.exposed = component.exposed || {};
  component.vnode = vnode;
  component.parent = parentComponent || component.parent;
  component.setup = setup || component.setup;
  component.type = type;
  if (type.__cache && !isCacheComponent(type)) {
    collectCacheComponent(type, component);
  }
}
function normalizeComponentProps(component, isSSR) {
  const builtinProps = {
    children: component.vnode.children,
    isSSR
  };
  const props = extend(component.props, builtinProps);
  return props;
}
function removeBuiltInProps(props) {
  const propsClone = extend({}, props);
  return omit(propsClone, ["isSSR", "children", "ref", "key", "memo", "static"]);
}

// ../runtime/src/h.ts
function h(type, props, children) {
  if (!type)
    return;
  if (isString(props)) {
    children = props;
    props = null;
  }
  if (isVNode(type)) {
    if (isPlanObject(props)) {
      extend(type.props = type.props || {}, props);
    }
    type.children = merge(type.children, children);
    return type;
  }
  return createVNode(type, props, children);
}

// ../runtime/src/context.ts
function provide(component, name, data) {
  component.ctx[name] = data;
}
function inject(component, name, shouldWarn = true) {
  let parentComponent = component.parent;
  while (parentComponent && !parentComponent.ctx[name]) {
    parentComponent = parentComponent.parent;
  }
  if (!parentComponent) {
    if (shouldWarn) {
      warn(
        "Contextual information not obtained, key: " + String(name),
        component,
        "inject"
      );
    }
    return null;
  }
  return parentComponent.ctx[name];
}
function useProvide() {
  const component = getCurrentComponent();
  return (name, data) => provide(component, name, data);
}
function useInject() {
  const component = getCurrentComponent();
  return (name) => inject(component, name);
}
function useComponentContext() {
  const component = getCurrentComponent();
  return {
    context: component.ctx,
    provide: useProvide(),
    inject: useInject()
  };
}

// ../runtime/src/ErrorBoundary.ts
function getErrorBoundaryCtx(component) {
  return inject(component, ErrorBoundaryType, false);
}
var ErrorBoundaryType = Symbol.for("gyron.error-boundary");
var ErrorBoundary = FC(function ErrorBoundary2() {
  const state = useReactive({
    error: false,
    payload: null
  });
  useProvide()(
    ErrorBoundaryType,
    ({ type, message, component, stack }) => {
      state[type.toLocaleLowerCase()] = true;
      state.payload = {
        type,
        message,
        component,
        stack
      };
    }
  );
  return function ErrorBoundaryRender({ children, fallback }) {
    return state.error ? isFunction(fallback.type) ? h(fallback, state.payload) : fallback : children;
  };
});

// ../runtime/src/Transition.ts
function normalizedClassName(props) {
  return {
    activeBefore: props.activeBeforeClassName || `${props.name}-active-before`,
    active: props.activeClassName || `${props.name}-active`,
    leaveBefore: props.leaveBeforeClassName || `${props.name}-leave-before`,
    leave: props.leaveClassName || `${props.name}-leave`
  };
}
var _uid = 0;
function whenTransitionEnd(el, duration, done, debugOptions) {
  const id = el.__uid__ = ++_uid;
  function onEnd() {
    el.removeEventListener("transitionend", onEnd);
    if (el.__uid__ === id) {
      done();
    }
  }
  if (isNumber(duration)) {
    return setTimeout(onEnd, duration);
  }
  const transition = debugOptions ? debugOptions.transition : window.getComputedStyle(el).getPropertyValue("transition");
  const hasTransition = transition !== "all 0s ease 0s";
  if (hasTransition) {
    el.addEventListener("transitionend", onEnd);
  } else {
    onEnd();
  }
}
function onAddClassName(el, name) {
  el.classList.add(name);
}
function onRemoveClassName(el, name) {
  el.classList.remove(name);
}
function onBeforeActiveHook(el, props) {
  onAddClassName(el, props.cls.activeBefore);
}
function onActiveHook(el, props, done) {
  return requestAnimationFrame(() => {
    onRemoveClassName(el, props.cls.activeBefore);
    onAddClassName(el, props.cls.active);
    whenTransitionEnd(el, props.duration?.active, done);
  });
}
function onBeforeLeaveHook(el, props) {
  onAddClassName(el, props.cls.leaveBefore);
}
function onLeaveHook(el, props, done) {
  return requestAnimationFrame(() => {
    onRemoveClassName(el, props.cls.leaveBefore);
    onAddClassName(el, props.cls.leave);
    whenTransitionEnd(el, props.duration?.leave, done);
  });
}
function onActiveFinish(el, props) {
  onRemoveClassName(el, props.cls.activeBefore);
  onRemoveClassName(el, props.cls.active);
}
function onLeaveFinish(el, props) {
  onRemoveClassName(el, props.cls.leaveBefore);
  onRemoveClassName(el, props.cls.leave);
}
function normalizeTransitionProps(props) {
  function normalizeDuration(duration) {
    if (isNumber(duration)) {
      return {
        active: duration,
        leave: duration
      };
    }
    return duration;
  }
  return {
    cls: normalizedClassName(props),
    duration: normalizeDuration(props.duration)
  };
}
function useTransitionState() {
  const leaveInnerNodes = /* @__PURE__ */ new Map();
  const activeInnerNodes = /* @__PURE__ */ new Map();
  return {
    leaveInnerNodes,
    activeInnerNodes
  };
}
function processFinish(state, vnode, type, method) {
  const n = state[type].get(vnode.type);
  const n1 = n && n[vnode.key];
  if (n1 && n1.el && n1.el[method]) {
    const f = n1.el[method];
    n1.el[method] = void 0;
    isFunction(f) && f();
    delete n[vnode.key];
  }
}
function setInnerVNode(state, vnode, type) {
  const cache = state[type];
  if (shouldValue(vnode.key)) {
    if (cache.has(vnode.type)) {
      const n = cache.get(vnode.type);
      n[vnode.key] = vnode;
    } else {
      cache.set(vnode.type, {
        [vnode.key]: vnode
      });
    }
  } else if (false) {
    warn2(
      `An exception has occurred, please submit error code ${InnerCode.Transition} to issue`,
      vnode.component,
      "Transition"
    );
  }
}
function generateTransitionHook(vnode, state, props) {
  return {
    state,
    onActive(el) {
      processFinish(state, vnode, "leaveInnerNodes", "__remove__");
      setInnerVNode(state, vnode, "activeInnerNodes");
      const done = el.__active__ = () => {
        onActiveFinish(el, props);
      };
      onBeforeActiveHook(el, props);
      onActiveHook(el, props, done);
    },
    onLeave(el, remove2) {
      processFinish(state, vnode, "activeInnerNodes", "__active__");
      setInnerVNode(state, vnode, "leaveInnerNodes");
      const done = el.__remove__ = () => {
        onLeaveFinish(el, props);
        remove2();
      };
      onBeforeLeaveHook(el, props);
      onLeaveHook(el, props, done);
    },
    onLeaveFinish(el) {
      onLeaveFinish(el, props);
    }
  };
}
function setTransition(vnode, hooks) {
  vnode.transition = hooks;
}
var Transition = FC(function Transition2() {
  const state = useTransitionState();
  return function TransitionChildren(props, component) {
    const n1 = component.subTree;
    const n2 = props.children;
    const normalizeProps = normalizeTransitionProps(props);
    if (isVNode(n2) && !isVNodeComment(n2)) {
      setTransition(n2, generateTransitionHook(n2, state, normalizeProps));
    }
    if (isVNode(n1) && !isVNodeComment(n1)) {
      setTransition(n1, generateTransitionHook(n1, state, normalizeProps));
    }
    return n2;
  };
});

// ../runtime/src/hmr.ts
var record = /* @__PURE__ */ new Map();
var dep = /* @__PURE__ */ new Map();
function rerenderParent(id) {
  const dependence = dep.get(id);
  if (dependence) {
    for (const parent of dependence.values()) {
      const instance = record.get(parent);
      if (instance && instance.type) {
        rerender(parent, instance.type);
      }
    }
  }
}
function rerender(id, type) {
  const instance = record.get(id);
  if (instance) {
    instance.setup = null;
    normalizeComponent(extend(instance.vnode, { type }), instance);
    record.set(id, instance);
    if (!instance.destroyed) {
      instance.update();
    }
    rerenderParent(id);
  } else {
    if (true) {
      console.warn(
        "An exception occurs during the hot update collection task, please submit issues to us at https://github.com/gyronorg/core",
        id,
        type
      );
    }
  }
}

// ../runtime/src/ref.ts
function createRef(initialValue) {
  return {
    current: initialValue
  };
}
function setRef(ref, userRef) {
  userRef.current = ref;
}

// ../runtime/src/hydrate.ts
function locateClosingAsyncAnchor(node) {
  let match = 0;
  while (node) {
    node = nextSibling(node);
    if (node && isComment(node)) {
      if (node.data === "[")
        match++;
      if (node.data === "]") {
        if (match === 0) {
          return nextSibling(node);
        } else {
          match--;
        }
      }
    }
  }
  return node;
}
function mismatch(node, vnode, isFragment) {
  if (false) {
    console.warn(
      `[hydrate] server render mismatch.
Client Type: `,
      node,
      `
Server Type: `,
      vnode
    );
  }
  vnode.el = null;
  if (isFragment) {
    const end = locateClosingAsyncAnchor(node);
    while (true) {
      const next2 = nextSibling(node);
      if (next2 && next2 !== end) {
        remove(next2);
      } else {
        break;
      }
    }
  }
  const next = nextSibling(node);
  const container = node.parentNode;
  remove(node);
  patch(null, vnode, container, next);
  return next;
}
function hydrate(node, vnode, parentComponent = null, ssrMessage = null) {
  const isFragmentStart = isComment(node) && node.data === "[";
  const { type, children } = vnode;
  vnode.el = node;
  let nextNode = null;
  switch (type) {
    case Text:
      const textNode = node;
      if (node.nodeType !== 3 /* Text */) {
        nextNode = mismatch(node, vnode, isFragmentStart);
      } else {
        if (textNode.data !== children) {
          if (false) {
            console.warn(
              `[hydrate] text data mismatch.
server text: ${textNode.data}
client text: ${children}`
            );
          }
          textNode.data = children;
        }
        nextNode = nextSibling(node);
      }
      break;
    case Comment:
      const commentNode = node;
      if (node.nodeType !== 8 /* Comment */) {
        nextNode = mismatch(node, vnode, isFragmentStart);
      } else {
        commentNode.data = children || "";
        nextNode = nextSibling(node);
      }
      break;
    case Fragment:
      if (!isFragmentStart) {
        nextNode = mismatch(node, vnode, isFragmentStart);
      } else {
        nextNode = hydrateFragment(node, vnode, parentComponent, ssrMessage);
      }
      break;
    case Element:
      if (node.nodeType !== 1 /* Element */) {
        nextNode = mismatch(node, vnode, isFragmentStart);
      } else {
        nextNode = hydrateElement(node, vnode, parentComponent, ssrMessage);
      }
      break;
    default:
      hydrateComponent(
        vnode,
        parentComponent,
        ssrMessage
      );
      nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node);
  }
  return nextNode;
}
function hydrateComponent(vnode, parentComponent = null, ssrMessage = null) {
  const container = vnode.el.parentNode;
  if (ssrMessage && vnode.__uri) {
    const ssrProps = ssrMessage[vnode.__uri];
    extend(vnode.props, ssrProps);
  }
  mountComponent(vnode, container, vnode.anchor, parentComponent, ssrMessage);
}
function hydrateFragment(node, vnode, parentComponent = null, ssrMessage = null) {
  const container = node.parentNode;
  vnode.el = null;
  const next = hydrateChildren(
    nextSibling(node),
    vnode,
    container,
    parentComponent,
    ssrMessage
  );
  if (next && isComment(next) && next.data === "]") {
    return nextSibling(vnode.anchor = next);
  } else {
    if (false) {
      console.warn(
        "[hydrate] RenderToString did not handle the fragment correctly, no terminator found"
      );
    }
    insert(vnode.anchor = createComment(`]`), container, next);
    return next;
  }
}
function hydrateElement(node, vnode, parentComponent = null, ssrMessage = null) {
  const { children, el } = vnode;
  if (vnode.props.ref) {
    setRef(el, vnode.props.ref);
  }
  const props = removeBuiltInProps(vnode.props);
  if (shouldValue(keys(props))) {
    mountProps(el, extend({}, vnode, { props }));
  }
  if (shouldValue(children)) {
    vnode.children = normalizeChildrenVNode(vnode);
    hydrateChildren(node.firstChild, vnode, node, parentComponent, ssrMessage);
  }
  return nextSibling(node);
}
function hydrateChildren(node, parentVNode, container, parentComponent = null, ssrMessage = null) {
  const children = parentVNode.children;
  for (let i = 0; i < children.length; i++) {
    const nodeChild = normalizeVNodeWithLink(children[i], parentVNode);
    if (node) {
      node = hydrate(node, nodeChild, parentComponent, ssrMessage);
    } else if (nodeChild.type === Text) {
      continue;
    } else {
      patch(null, nodeChild, container);
    }
  }
  return node;
}

// ../runtime/src/scheduler.ts
var queue = [];
var resolvedPromise = Promise.resolve();
var frameYield = 5;
var delaysTime = 1e3 / 60;
var pendingJobPromise = [];
var currentJobPromise;
var startTime = -1;
function nextRender(fn) {
  const p = Promise.all(pendingJobPromise || [resolvedPromise]).finally(() => {
    pendingJobPromise.length = 0;
  });
  return fn ? p.then(fn) : p;
}
function useDeferred(fn) {
}
function useAccrued(fn) {
}
function pushQueueJob(job) {
  if (job.id === null) {
    queue.push(job);
  } else {
    const index = queue.findIndex((item) => item.id === job.id);
    if (index >= 0) {
      queue.splice(index, 1, job);
    } else {
      queue.push(job);
    }
  }
  currentJobPromise = resolvedPromise.then(flushJobs);
  pendingJobPromise.push(currentJobPromise);
}
function flushJobs() {
  try {
    startTime = now();
    return workLoop();
  } catch {
    queue.length = 0;
  }
}
var now = () => {
  return typeof performance === "object" ? performance.now() : Date.now();
};
var self = typeof global === "object" ? global : window;
var navigator = self.navigator;
var isInputPending = typeof navigator !== "undefined" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 ? navigator.scheduling.isInputPending.bind(navigator.scheduling) : null;
var timeout = (callback, ms) => {
  if (self.requestIdleCallback) {
    requestIdleCallback(callback, { timeout: ms });
  } else {
    setTimeout(callback, ms);
  }
};
function shouldYieldHost() {
  if (now() - startTime > frameYield) {
    return true;
  }
  if (isInputPending !== null) {
    return isInputPending();
  }
  return true;
}
function workLoop(pendingJobs) {
  return new Promise((resolve) => {
    queue.sort((a, b) => a.id - b.id);
    const jobs = pendingJobs || queue;
    let currentJob = jobs.shift();
    let idleJob;
    while (currentJob) {
      callWithErrorHandling(
        currentJob,
        currentJob.component,
        "Scheduler" /* Scheduler */
      );
      if (shouldYieldHost() && jobs.length > 0) {
        idleJob = new Promise((resolve2) => {
          startTime = now();
          const pendingJobs2 = [...jobs];
          timeout(() => {
            workLoop(pendingJobs2).then(resolve2);
          }, delaysTime);
          jobs.length = 0;
        });
        break;
      }
      currentJob = jobs.shift();
    }
    if (idleJob) {
      idleJob.then(resolve);
    } else {
      resolve();
    }
  });
}

// ../runtime/src/render.ts
function shouldUpdate(result) {
  return !(isBoolean(result) && !result);
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
function isKeyPatch(n1, n2) {
  if (n1 && n2 && n1[0] && n2[0] && isObject(n1[0]) && isObject(n2[0])) {
    return shouldValue(n1[0].key) && shouldValue(n2[0].key);
  }
  return false;
}
function getNextSibling(vnode) {
  if (vnode.component) {
    return getNextSibling(vnode.component.subTree);
  }
  if (vnode.el || vnode.anchor) {
    return nextSibling(vnode.el || vnode.anchor);
  }
  return null;
}
function mountChildren(nodes, container, anchor, start = 0, parentComponent = null, isSvg) {
  for (let i = start; i < nodes.length; i++) {
    const node = normalizeVNode(nodes[i]);
    patch(null, node, container, anchor, parentComponent, isSvg);
  }
}
function removeInvoke(_el, vnode, done) {
  const { transition } = vnode;
  const el = _el;
  if (transition) {
    transition.onLeave(el, () => {
      remove(el);
      done();
    });
  } else {
    remove(el);
    done();
  }
}
function unmount(vnode) {
  if (!isVNode(vnode)) {
    return null;
  }
  function reset() {
    vnode.el = null;
  }
  const { el, component, children, transition } = vnode;
  if (component) {
    if (!isCacheComponent(component.type)) {
      component.effect.stop();
    }
    if (component.subTree) {
      unmount(component.subTree);
    }
    invokeLifecycle(component, "destroyed");
    if (component.$el) {
      removeInvoke(component.$el, vnode, reset);
      if (!isCacheComponent(component.type)) {
        component.$el = null;
      }
    }
    component.destroyed = true;
    component.mounted = false;
  } else {
    if (!transition) {
      if (isArray(children) && children.length > 0) {
        unmountChildren(children);
      } else {
        unmount(children);
      }
    }
    if (isElement(el)) {
      removeInvoke(el, vnode, reset);
    }
  }
}
function unmountChildren(c1, start = 0) {
  for (let i = start; i < c1.length; i++) {
    unmount(c1[i]);
  }
}
function patchNonKeyed(c1, c2, container, anchor, parentComponent, isSvg) {
  const c1length = c1.length;
  const c2length = c2.length;
  const minLength = Math.min(c1length, c2length);
  for (let i = 0; i < minLength; i++) {
    const prevChild = c1[i];
    const nextChild = c2[i];
    patch(prevChild, nextChild, container, anchor, parentComponent);
  }
  if (c1length > c2length) {
    unmountChildren(c1, minLength);
  } else {
    mountChildren(c2, container, anchor, minLength, parentComponent, isSvg);
  }
}
function patchKeyed(c1, c2, container, anchor, parentComponent, isSvg) {
  const o1 = c1.reduce((nodeMap, node, index) => {
    nodeMap[node.key] = extend(node, { index });
    return nodeMap;
  }, {});
  const e2 = c2.length;
  let i = 0;
  while (i < e2) {
    const c2n = c2[i];
    const c1n = o1[c2n.key];
    if (c1n) {
      const el = mergeVNodeWith(c2n, c1n).el;
      if (c1n.index !== i) {
        const anchor2 = container.childNodes[i];
        if (el !== anchor2.nextSibling) {
          insert(el, container, anchor2.nextSibling);
        }
      }
      if (!isEqual(c1n.props, c2n.props)) {
        const isComponent = isVNodeComponent(c2n) && isVNodeComponent(c1n);
        if (isComponent) {
          patchComponent(c1n, c2n, container, anchor, parentComponent);
        } else {
          patchProps(
            el,
            c1n,
            extend({}, c2n, { props: removeBuiltInProps(c2n.props) })
          );
        }
      }
      if (c1n.children || c2n.children) {
        patchChildren(c1n, c2n, container, anchor, parentComponent, isSvg);
      }
      c1n.inserted = true;
    } else {
      patch(null, c2n, container, anchor, parentComponent, isSvg);
    }
    i++;
  }
  for (const node of Object.values(o1)) {
    if (!node.inserted) {
      unmount(node);
    }
  }
}
function patchChildren(n1, n2, container, anchor, parentComponent, isSvg) {
  if (isFunction(n1.children) && isFunction(n2.children)) {
    return;
  }
  const c1memo = n1.props.memo;
  const c2memo = n2.props.memo;
  if (isArray(c1memo) && isArray(c2memo)) {
    const index = c1memo.findIndex((item, index2) => {
      return c2memo[index2] !== item;
    });
    if (index < 0) {
      n2.children = n1.children;
      return;
    }
  }
  const c1 = n1.children;
  const c2 = n2.children = normalizeChildrenVNode(n2);
  if (c1?.length || c2?.length) {
    if (isKeyPatch(c1, c2)) {
      const el = n2.el = n1.el;
      patchKeyed(c1, c2, el || container, anchor, parentComponent, isSvg);
    } else {
      const el = n2.el = n1.el;
      if (c1) {
        patchNonKeyed(c1, c2, el || container, anchor, parentComponent, isSvg);
      } else {
        mountChildren(c2, el || container, anchor, 0, parentComponent, isSvg);
      }
    }
  }
}
function mountElement(vnode, container, anchor, parentComponent, isSvg) {
  const { tag, is, transition } = vnode;
  const el = vnode.el = createElement(tag, isSvg, is);
  el.__vnode__ = vnode;
  if (vnode.props.ref) {
    setRef(el, vnode.props.ref);
  }
  const props = removeBuiltInProps(vnode.props);
  if (shouldValue(keys(props))) {
    mountProps(el, extend({}, vnode, { props }));
  }
  if (shouldValue(vnode.children)) {
    vnode.children = normalizeChildrenVNode(vnode);
    mountChildren(vnode.children, vnode.el, anchor, 0, parentComponent, isSvg);
  }
  insert(el, container, anchor);
  if (transition) {
    transition.onActive(el);
  }
}
function patchElement(n1, n2, container, anchor, parentComponent, isSvg) {
  const el = n2.el = n1.el;
  if (el.nodeName === n2.tag.toLocaleUpperCase()) {
    if (!isEqual(n1.props, n2.props) || isSelectElement(n2)) {
      patchProps(
        el,
        n1,
        extend({}, n2, { props: removeBuiltInProps(n2.props) })
      );
    }
    if (n1.children || n2.children) {
      patchChildren(n1, n2, container, anchor, parentComponent, isSvg);
    }
  } else {
    anchor = getNextSibling(n1);
    unmount(n1);
    patch(null, n2, container, anchor, parentComponent, isSvg);
  }
}
function patchSubTree(component, prevTree, nextTree) {
  component.subTree = nextTree;
  if (component.mounted) {
    const { anchor } = prevTree;
    component.subTree.anchor = anchor;
    patch(prevTree, nextTree, component.$parent, anchor, component);
    invokeLifecycle(component, "afterUpdates");
    component.$el = nextTree.el;
  } else {
    patch(null, nextTree, component.$parent, component.vnode.anchor, component);
    component.vnode.el = nextTree.el;
    component.$el = nextTree.el;
    component.mounted = true;
    component.effect.allowEffect = true;
    invokeLifecycle(component, "afterMounts");
    component.effect.allowEffect = false;
  }
}
function updateComponentEffect(component, ssrMessage = null) {
  if (component.mounted) {
    if (shouldUpdate(invokeLifecycle(component, "beforeUpdates")) && shouldUpdate(!component.props.static)) {
      if (false) {
        refreshComponentType(component.vnode, component);
      }
      const prevTree = component.subTree;
      const nextTree = renderComponent(component);
      if (isPromise(nextTree)) {
        warn(
          "Asynchronous components without wrapping are not supported, please use FCA wrapping",
          component,
          "UpdateComponent"
        );
      } else {
        patchSubTree(component, prevTree, nextTree);
      }
    }
  } else if (!component.destroyed) {
    if (component.vnode.el) {
      let hydrateSubTree = function() {
        const nextTree = renderComponent(component);
        component.subTree = nextTree;
        hydrate(component.vnode.el, component.subTree, component, ssrMessage);
        component.mounted = true;
        invokeLifecycle(component, "afterMounts");
      };
      if (isAsyncComponent(component.vnode.type)) {
        component.vnode.type.__loader(component.props, component).then(() => {
          if (!component.destroyed) {
            asyncTrackEffect(component.effect);
            hydrateSubTree();
            clearTrackEffect();
          }
        });
      } else {
        hydrateSubTree();
      }
    } else {
      const nextTree = renderComponent(component);
      if (isPromise(nextTree)) {
        warn(
          "Asynchronous components without wrapping are not supported, please use FCA wrapping",
          component,
          "SetupPatch"
        );
      } else {
        nextTree.transition ||= component.vnode.transition;
        patchSubTree(component, null, nextTree);
      }
    }
  }
}
function renderComponentEffect(component, ssrMessage = null) {
  const effect = component.effect = createEffect(
    updateComponentEffect.bind(null, component, ssrMessage),
    () => pushQueueJob(component.update)
  );
  const update = component.update = effect.run.bind(effect);
  update.id = component.uid;
  update.component = component;
  update.priority = 0 /* NORMAL */;
  update();
}
function mountComponent(vnode, container, anchor, parentComponent, ssrMessage = null) {
  vnode.anchor = anchor;
  const component = vnode.component = createComponentInstance(
    vnode,
    parentComponent
  );
  component.$parent = container;
  if (false) {
    refreshComponentType(vnode, component);
    const parentId = parentComponent ? parentComponent.type.__hmr_id : null;
    collectHmrComponent(component.type.__hmr_id, parentId, component);
  }
  if (component.props.ref) {
    setRef(component.exposed, component.props.ref);
  }
  renderComponentEffect(component, ssrMessage);
}
function patchComponent(n1, n2, container, anchor, parentComponent) {
  const component = n2.component = n1.component;
  if (component) {
    normalizeComponent(n2, component, parentComponent);
    if (isCacheComponent(n1.component.type)) {
      if (!isEqual(n1.props, n2.props)) {
        component.update();
      }
    } else {
      component.update();
    }
  } else {
    if (true) {
      console.warn("Component update exception", n1);
    }
    mountComponent(n2, container, anchor, parentComponent);
  }
}
function enterComponent(n1, n2, container, anchor, parentComponent) {
  if (n1 === null) {
    n2.el = null;
    if (isCacheComponent(n2.type)) {
      const component = getCacheComponent(n2.type);
      component.destroyed = false;
      component.mounted = true;
      component.vnode = n2;
      component.$parent = container;
      if (isEqual(removeBuiltInProps(component.props), n2.props)) {
        patch(null, component.subTree, container, anchor, parentComponent);
      } else {
        mountComponent(n2, container, anchor, parentComponent);
      }
    } else {
      mountComponent(n2, container, anchor, parentComponent);
    }
  } else {
    n2.anchor ||= n1.anchor;
    patchComponent(n1, n2, container, anchor, parentComponent);
  }
}
function transitionMove(n1, n2, container, anchor, parentComponent, isSvg) {
  const { transition } = n1;
  const el = n1.el;
  transition.onLeaveFinish(el);
  unmount(n1);
  patch(
    null,
    n2,
    container,
    anchor || getNextSibling(n1),
    parentComponent,
    isSvg
  );
}
function enterElement(n1, n2, container, anchor, parentComponent, isSvg) {
  isSvg = isSvg || n2.tag === "svg";
  if (n1 === null) {
    mountElement(n2, container, anchor, parentComponent, isSvg);
  } else if (!n2.props.static) {
    if (n1.transition) {
      transitionMove(n1, n2, container, anchor, parentComponent, isSvg);
    } else {
      patchElement(n1, n2, container, anchor, parentComponent, isSvg);
    }
  }
}
function enterFragment(n1, n2, container, anchor, parentComponent, isSvg) {
  const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : createText("");
  if (n1 === null) {
    n2.anchor = fragmentEndAnchor;
    insert(fragmentEndAnchor, container, anchor);
    n2.children = normalizeChildrenVNode(n2);
    mountChildren(
      n2.children,
      container,
      fragmentEndAnchor,
      0,
      parentComponent,
      isSvg
    );
  } else {
    patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, isSvg);
  }
}
function enterComment(n1, n2, container, anchor) {
  if (n1 === null) {
    const comment = createComment(
      n2.children || ""
    );
    comment.__vnode__ = n2;
    n2.el = comment;
    insert(comment, container, anchor);
  } else {
    n2.el = n1.el;
    n2.el.__vnode__ = n2;
  }
}
function enterText(n1, n2, container, anchor) {
  if (n1 === null || !n1.el) {
    const textNode = createText(n2.children);
    textNode.__vnode__ = n2;
    n2.el = textNode;
    insert(textNode, container, anchor);
  } else {
    const el = n2.el = n1.el;
    const c1 = "" + n1.children;
    const c2 = "" + n2.children;
    if (c1 !== c2) {
      el.textContent = c2;
    }
  }
}
function patch(n1, n2, container, anchor = null, parentComponent = null, isSvg = false) {
  if (!container) {
    throw new Error(
      "The parent element is not found when updating, please check the code."
    );
  }
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextSibling(n1);
    unmount(n1);
    n1 = null;
  }
  switch (n2.type) {
    case Text:
      enterText(n1, n2, container, anchor);
      break;
    case Comment:
      enterComment(n1, n2, container, anchor);
      break;
    case Element:
      enterElement(n1, n2, container, anchor, parentComponent, isSvg);
      break;
    case Fragment:
      enterFragment(n1, n2, container, anchor, parentComponent, isSvg);
      break;
    default:
      enterComponent(
        n1,
        n2,
        container,
        anchor,
        parentComponent
      );
  }
}

// ../runtime/src/instance.ts
function createContext() {
  return /* @__PURE__ */ new Map();
}
function render(vnode, container) {
  patch(null, vnode, container);
}
function createInstance(root, isHydrate) {
  if (false) {
    checkVersion();
  }
  const instance = {
    container: null,
    render(containerOrSelector) {
      instance.container = getUserContainer(containerOrSelector);
      if (!instance.container) {
        console.warn(
          "Node not found in the document. The parameter is",
          containerOrSelector
        );
        return null;
      }
      const firstChild = instance.container.firstChild;
      if (isHydrate || firstChild && firstChild.__vnode__) {
        hydrate(firstChild, root);
        return instance;
      }
      render(root, instance.container);
      return instance;
    },
    destroy() {
      if (instance.container) {
        unmount(root);
      }
      return instance;
    }
  };
  return instance;
}

// ../runtime/src/plugin.ts
var plugins = createContext();
function getPlugins() {
  return plugins;
}

// ../runtime/src/ssr.ts
function createSSRInstance(vnode) {
  const ssr = createInstance(vnode, true);
  return extend(ssr, { root: vnode });
}
function createSSRContext(context) {
  return {
    render: (vnode, containerOrSelector) => {
      const container = getUserContainer(containerOrSelector);
      if (!container) {
        console.warn(
          "Node not found in the document. The parameter is",
          containerOrSelector
        );
        return null;
      }
      hydrate(container.firstChild, vnode, null, context.message);
      return vnode;
    }
  };
}

// src/helper.ts
function objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  const target = {};
  const sourceKeys = Object.keys(source);
  let key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null)
    return input;
  const prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    const res = prim.call(input, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function toPropertyKey(arg) {
  const key = toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function objectDestructuringEmpty(obj) {
  if (obj == null)
    throw new TypeError("Cannot destructure undefined");
}

// src/index.ts
var src_default = src_exports;
export {
  Comment,
  Element,
  ErrorBoundary,
  FC,
  FCA,
  Fragment,
  Text,
  Transition,
  asyncTrackEffect,
  cleanupTrackEffect,
  clearCacheComponent,
  clearTrackEffect,
  cloneVNode,
  createComponentInstance,
  createContext,
  createInstance,
  createRef,
  createSSRContext,
  createSSRInstance,
  createVNode,
  createVNodeComment,
  src_default as default,
  defineProps,
  enableTrack,
  error,
  exposeComponent,
  forceUpdate,
  getCurrentComponent,
  getPlugins,
  h,
  hydrate,
  inject,
  isResponsive,
  isVNode,
  isVNodeComment,
  isVNodeComponent,
  isVNodeElement,
  isVNodeFragment,
  isVNodeText,
  keepComponent,
  manualErrorHandler,
  manualWarnHandler,
  mergeVNode,
  nextRender,
  normalizeChildrenVNode,
  normalizeVNode,
  normalizeVNodeWithLink,
  objectDestructuringEmpty,
  objectWithoutPropertiesLoose,
  onAfterMount,
  onAfterUpdate,
  onBeforeMount,
  onBeforeUpdate,
  onDestroyed,
  pauseTrack,
  provide,
  registerErrorHandler,
  registerWarnHandler,
  removeBuiltInProps,
  render,
  renderComponent,
  rerender,
  toPrimitive,
  toPropertyKey,
  toRaw,
  useAccrued,
  useComponentContext,
  useComputed,
  useDeferred,
  useEffect,
  useInject,
  useMemo,
  useProvide,
  useReactive,
  useValue,
  useWatch,
  warn
};
//# sourceMappingURL=index.js.map
