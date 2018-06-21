import Vuex from 'vuex';
import MuseModel from './MuseModel';
export { default as Model } from './model';
import mixin from './mixin';

export function createMuseModel (options) {
  const store = new Vuex.Store(options);
  new MuseModel(store);
  return store;
}
export default {
  version: '__VERSION__',
  install (Vue, options) {
    Vue.use(Vuex);
    Vue.mixin(mixin);
  },
  createMuseModel
};
