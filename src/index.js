import Vuex from 'vuex';
import MuseModel from './MuseModel';
import mixin from './mixin';
import { model, getter, action } from './model';
import { loading, watch, generateMutations, callHook } from './extensions';

export function createMuseModel (options = {}) {
  options.mutations = options.mutations || {};
  options.mutations = {
    ...options.mutations,
    ...generateMutations()
  };
  const store = new Vuex.Store(options);
  new MuseModel(store);
  return store;
}

export {
  model,
  action,
  getter,
  loading,
  watch
};

export default {
  version: '__VERSION__',
  install (Vue) {
    Vue.use(Vuex);
    Vue.mixin(mixin);
    callHook('install', Vue);
  },
  createMuseModel
};
