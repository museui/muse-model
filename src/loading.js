import { isPromise, error } from './utils';
import { getMuseModel } from './MuseModel';
const SHOW = 'MUSE_MODEL_SHOW_LOADING';
const HIDE = 'MUSE_MODEL_HIDE_LOADING';

function setObjAttr (obj, attrs, value) {
  attrs.forEach((key, index) => {
    if (attrs.length - index <= 1) {
      obj[key] = value;
      return;
    }
    obj = obj[key];
  });
}

function resolveLoading (target, name = 'loading', descriptor) {
  const oldValue = descriptor.value;
  descriptor.value = function () {
    const result = oldValue.apply(this, arguments);
    if (!isPromise(result)) return;
    const museModel = getMuseModel();
    if (!museModel) error('not MuseModel instance, please add new MuseModel(store).');
    const $store = museModel.$store;
    const attrs = [this.namespace].concat(name.split('.'));
    $store.commit({ type: SHOW, attrs });
    const handleThen = (res) => {
      $store.commit({ type: HIDE, attrs });
      return res;
    };
    return result.then(handleThen, (res) => {
      handleThen(res);
      return Promise.reject(res);
    });
  };
  return descriptor;
}

export const mutations = {
  [SHOW] (state, payload) {
    setObjAttr(state, payload.attrs, true);
  },
  [HIDE] (state, payload) {
    setObjAttr(state, payload.attrs, false);
  }
};

export const loading = function (name) {
  if (typeof name === 'string') return (target, n, descriptor) => resolveLoading(target, name, descriptor);
  return resolveLoading(arguments[0], 'loading', arguments[2]);
};
