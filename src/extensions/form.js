import { setObjAttr, getObjAttr } from '../utils';

const CHANGE = 'MUSE_MODEL_CHANGE_VALUE';

const directive = {
  name: 'mu-model',
  bind (el, binding, vnode) {
    const expression = binding.expression;
    const vm = vnode.componentInstance;
    const $store = vm.$store;
    const { prop = 'value', event = 'input' } = vm.$options.model || {};
    vm[prop] = getObjAttr($store.state, expression);
    const handleInput = (e) => {
      const value = e instanceof Event ? e.target.value : e;
      $store.commit(CHANGE, {
        path: expression,
        value
      });
      vm[prop] = getObjAttr($store.state, expression);
    };
    el[CHANGE] = {
      event,
      prop,
      callback: handleInput
    };
    vm.$on(event, handleInput);
  },
  unbind (el, binding, vnode) {
    const vm = vnode.componentInstance;
    vm.$off(el[CHANGE].event, el[CHANGE].callback);
  }
};

export default {
  install (Vue) {
    Vue.directive(directive.name, directive);
  },
  mutations: {
    [CHANGE] (state, payload) {
      setObjAttr(state, payload.path, payload.value);
    }
  }
};
