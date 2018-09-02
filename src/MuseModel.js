import { error } from './utils';
import { mapState, mapGetters } from 'vuex';
import { callHook } from './extensions';

export default class MuseModel {
  constructor (store) {
    this.$store = store;
    this.models = [];
    this.modelMap = {};
    setMuseModel(this);
    callHook('init', this);
  }

  hasModel (namespace) {
    let index = -1;
    for (let i = 0; i < this.models.length; i++) {
      if (this.models[i].namespace === namespace) {
        index = i;
        break;
      }
    }
    return index !== -1;
  }

  registerModel (model) {
    if (!model.namespace || !model.__module__) error(`${model.namespace} is not model, please use model(options)`);
    if (this.hasModel(model)) return;
    this.$store.registerModule(model.namespace, model.__module__);
    this.models.push(model);
    this.modelMap[model.namespace] = this.generateModelMap(model);
    callHook('registered', model, this);
  }

  generateModelMap (model) {
    const result = {
      state: {},
      getters: {}
    };
    const namespace = model.namespace;
    Object.keys(model.state).forEach(key => (result.state[key] = state => state[namespace][key]));
    result.state = mapState(result.state);
    Object.keys(model.getters).forEach(key => (result.getters[key] = `${namespace}/${key}`));
    result.getters = mapGetters(result.getters);
    model._actions.forEach(key => {
      if (typeof model[key] !== 'function') return;
      result[key] = (...args) => {
        return model[key].apply(model, args);
      };
    });
    return result;
  }

  getModelMap (...args) {
    if (!args || args.length === 0) return;
    const map = {};
    args.forEach(({ namespace }) => {
      map[namespace] = this.modelMap[namespace];
    });
    return map;
  }
}

let museModel;
let models = [];

export function getMuseModel () {
  return museModel;
}

export function setMuseModel (instance) {
  museModel = instance;
  if (models && models.length > 0) {
    models.forEach((model) => museModel.registerModel(model));
    models = [];
  }
}

export function registerModel (model) {
  if (museModel) {
    museModel.registerModel(model);
  } else {
    models.push(model);
  };
  return model;
}
