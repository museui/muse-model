import Vue from 'vue';
import Vuex from 'vuex';
import MuseModel, { createMuseModel } from '../../src';
Vue.use(Vuex);
Vue.use(MuseModel);

export const store = new Vuex.Store({
  strict: true
});
export default createMuseModel(store);
