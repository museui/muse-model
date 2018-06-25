import Vuex from 'vuex';
import MuseModel from './MuseModel';
import Model from './model';
import mixin from './mixin';
import { model, action, getter } from './decorators';
import { mutations, loading } from './loading';

export function createMuseModel (options = {}) {
  options.mutations = options.mutations || {};
  options.mutations = {
    ...options.mutations,
    ...mutations
  };
  const store = new Vuex.Store(options);
  new MuseModel(store);
  return store;
}

export { Model, loading, model, action, getter };
export default {
  version: '__VERSION__',
  install (Vue) {
    Vue.use(Vuex);
    Vue.mixin(mixin);
  },
  createMuseModel
};
