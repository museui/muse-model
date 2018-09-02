import Vuex from 'vuex';
import MuseModel from './MuseModel';
import mixin from './mixin';
import { model, getter, action } from './model';
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

export { loading, model, action, getter };

export default {
  version: '__VERSION__',
  install (Vue) {
    Vue.use(Vuex);
    Vue.mixin(mixin);
  },
  createMuseModel
};
