import MuseModel from './MuseModel';
export { default as model } from './model';
import mixin from './mixin';

export function createMuseModel (store, options) {
  return new MuseModel(store, options);
}
export default {
  install (Vue) {
    Vue.mixin(mixin);
  }
};
