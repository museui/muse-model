import { changeState, error, isPromise, isPlainObject } from './utils';
import { registerModel, getMuseModel } from './MuseModel';

export function model (namespace) {
  if (!namespace) error('unable generate null model, model must have a namespace');
  return (Class) => {
    const instance = new Class();
    instance.namespace = namespace;
    createModule(instance);
    registerModel(instance);
    return instance;
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

function createModule (instance) {
  const module = {
    namespaced: true,
    state: instance.state,
    getters: {},
    mutations: {}
  };
  if (instance._actions && instance._actions.length > 0) {
    instance._actions.forEach(action => {
      module.mutations[action] = changeState;
    });
  }

  if (instance._getters && instance._getters.length > 0) {
    instance.getters = {};
    instance._getters.forEach(name => {
      if (!instance[name]) return;
      const getter = instance[name];
      instance.getters[name] = module.getters[name] = (...args) => {
        return getter.apply(instance, args);
      };
    });
  }
  instance.__module__ = module;
  return module;
}

export function resolveResult (result, path) {
  const museModel = getMuseModel();
  if (!museModel) error('not MuseModel instance, please add new MuseModel(store).');
  const $store = museModel.$store;
  switch (true) {
    case isPromise(result):
      result.then(result => $store.commit({ type: path, result }));
      return result;
    case isPlainObject(result):
      $store.commit({ type: path, result });
      return result;
  }
  return result;
}
