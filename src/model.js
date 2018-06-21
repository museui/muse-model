import { changeState, error, isPlainObject, isPromise } from './utils';

let museModel;
let models = [];

export function setMuseModel (instance) {
  museModel = instance;
  if (models && models.length > 0) {
    models.forEach((model) => museModel.registerModel(model));
    models = [];
  }
}

export function getMuseModel () {
  return museModel;
}

export default function (model) {
  model = generateModel(model);
  if (museModel) {
    museModel.registerModel(model);
  } else {
    models.push(model);
  };
  return model;
}

function mergeMixins (model, mixins) {
  if (!mixins || !Array.isArray(mixins) || mixins.length === 0) return;
  mixins.forEach((mixin) => {
    mergeMixins(model, mixin.mixins);
    ['getters', 'state'].forEach((name) => {
      model[name] = {
        ...(mixin[name] || {}),
        ...(model[name] || {})
      };
    });
    Object.keys(mixin).forEach((key) => {
      if (typeof mixin[key] !== 'function') return;
      if (model[key]) return;
      model[key] = mixin[key];
    });
  });
}

function generateModel (model) {
  if (!model || !model.namespace) error('unable generate null model, model must have a namespace');
  const namespace = model.namespace;
  mergeMixins(model, model.mixins);
  delete model.mixins;
  const module = {
    namespaced: true,
    state: model.state || {},
    getters: model.getters || {},
    mutations: {}
  };
  const storeModel = {
    namespace,
    state: model.state,
    getters: module.getters,
    module
  };

  Object.keys(model).forEach((actionKey) => {
    if (typeof model[actionKey] !== 'function') return;
    const mutationType = actionKey;
    const path = `${namespace}/${mutationType}`;
    const action = model[actionKey];
    module.mutations[mutationType] = changeState;
    storeModel[actionKey] = function (...args) {
      if (!museModel) error('not MuseModel instance, please add new MuseModel(store).');
      const $store = museModel.$store;
      const result = action.apply(storeModel, args);
      switch (true) {
        case isPlainObject(result):
          $store.commit({ type: path, result });
          return result;
        case isPromise(result):
          result.then(result => $store.commit({ type: path, result }));
          return result;
      }
      return result;
    };
  });

  return storeModel;
}
