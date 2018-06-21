import { setMuseModel } from './model';
import { error } from './utils';
import { mapState, mapGetters } from 'vuex';

export default class MuseModel {
  constructor (store) {
    this.$store = store;
    this.models = [];
    this.modelMap = {};
    setMuseModel(this);
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
    if (!model.namespace || !model.module) error(`${model.namespace} is not model, please use model(options)`);
    if (this.hasModel(model)) return;
    this.$store.registerModule(model.namespace, model.module);
    this.models.push(model);
    this.modelMap[model.namespace] = this.generateModelMap(model);
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
    Object.keys(model).forEach((key) => {
      if (typeof model[key] !== 'function') return;
      result[key] = model[key];
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
};
