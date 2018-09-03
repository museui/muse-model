import { setObjAttr, getObjAttr } from '../utils';

const CHANGE = 'MUSE_MODEL_CHANGE_VALUE';

const directive = {
  name: 'mu-model',
  bind (el, binding, vnode) {
    const expression = binding.expression;
    const vm = vnode.componentInstance;
    const $store = vnode.context.$store;
    let prop = 'value';
    let event = 'input';
    if (vm) {
      const model = vm.$options.model || {};
      prop = model.prop || 'value';
      event = model.event || 'input';
    }
    const handleInput = (e) => {
      const value = e instanceof Event ? e.target.value : e;
      $store.commit(CHANGE, {
        path: expression,
        value
      });
      if (vm) {
        vm[prop] = getObjAttr($store.state, expression);
      } else {
        el.value = value;
      }
    };

    el[CHANGE] = {
      event,
      prop,
      callback: handleInput
    };

    if (vm) {
      vm.value = getObjAttr($store.state, expression);
      vm.$on(event, handleInput);
    } else {
      el.value = getObjAttr($store.state, expression);
      el.addEventListener('input', handleInput);
    }
    $store.watch((state) => getObjAttr(state, expression), (val) => {
      if (vm) {
        vm.value = val;
      } else {
        el.value = val;
      }
    });
  },
  unbind (el, binding, vnode) {
    const info = el[CHANGE];
    if (info.element) {
      el.removeEventLister('input', info.handleInput);
    } else {
      const vm = vnode.componentInstance;
      if (!vm) return;
      vm.$off(el[CHANGE].event, el[CHANGE].callback);
    }
    delete el[CHANGE];
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
