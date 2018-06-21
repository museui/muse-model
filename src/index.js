import Vuex from 'vuex';
import MuseModel from './MuseModel';
import Model from './model';
import mixin from './mixin';

export function createMuseModel (options) {
  const store = new Vuex.Store(options);
  new MuseModel(store);
  return store;
}

export { Model };
export default {
  version: '__VERSION__',
  install (Vue) {
    Vue.use(Vuex);
    Vue.mixin(mixin);
  },
  createMuseModel
};
