export function warn (msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[muse-model] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

export function error (msg) {
  console.error(`[muse-model] ${msg}`);
  throw new Error('muse-model run error');
};

const toString = Object.prototype.toString;
const OBJECT_STRING = '[object Object]';
export function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING;
}

export function isPromise (val) {
  return val && typeof val.then === 'function';
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[muse-model] ${msg}`);
}

export function changeState (state, payload) {
  const result = payload.result;
  if (!result || !isPlainObject(result)) return;
  Object.keys(result).forEach((key) => (state[key] = result[key]));
}

export function getMergeOptions (map) {
  const actions = {};
  Object.keys(map).forEach(key => typeof map[key] === 'function' && (actions[key] = map[key]));
  return {
    computed: {
      ...map.state,
      ...map.getters
    },
    methods: {
      ...actions
    }
  };
};
