import Model, { resolveResult } from './model';
import { changeState, error } from './utils';

export function model (namespace, mixins) {
  if (!namespace) error('unable generate null model, model must have a namespace');
  return (Class) => {
    const instance = new Class();
    instance.namespace = namespace;
    mergeMixins(instance, mixins);
    const module = {
      namespaced: true,
      state: instance.state,
      getters: {},
      mutations: {}
    };
    const result = {
      namespace: namespace,
      state: instance.state,
      getters: {},
      module
    };

    if (instance._actions && instance._actions.length > 0) {
      instance._actions.forEach(action => {
        result[action] = instance[action].bind(instance);
        module.mutations[action] = changeState;
      });
    }

    if (instance._getters && instance._getters.length > 0) {
      instance._getters.forEach(name => {
        if (!instance[name]) return;
        const getter = instance[name].bind(instance);
        result.getters[name] = module.getters[name] = getter;
      });
    }
    return Model(result, true);
  };
}

export function action (target, name, descriptor) {
  if (!target._actions) target._actions = [];
  target._actions.push(name);
  const oldValue = descriptor.value;
  descriptor.value = function () {
    const path = `${this.namespace}/${name}`;
    const result = oldValue.apply(this, arguments);
    return resolveResult(result, path);
  };
  return descriptor;
}

export function getter (target, name, descriptor) {
  if (!target._getters) target._getters = [];
  target._getters.push(name);
  return descriptor;
}

function mergeMixins (proto, mixins) {
  if (!mixins || !Array.isArray(mixins) || mixins.length === 0) return;
  mixins.forEach((mixin) => {
    mergeMixins(proto, mixin.mixins);
    proto.state = {
      ...(mixin.state || {}),
      ...(proto.state || {})
    };
    if (mixin.getters) {
      Object.keys(mixin.getters).forEach((key) => {
        if (proto[key]) return;
        getter(proto, key);
        proto[key] = mixin.getters[key];
      });
    }
    Object.keys(mixin).forEach((key) => {
      if (typeof mixin[key] !== 'function') return;
      if (proto[key]) return;
      const value = action(proto, key, { value: mixin[key] }).value;
      proto[key] = value;
    });
  });
}
