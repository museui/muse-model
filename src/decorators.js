import Model, { resolveResult } from './model';
import { changeState } from './utils';
export function model (namespace) {
  return (Class) => {
    const instance = new Class();
    instance.namespace = namespace;
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
    console.log('model', result);
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
