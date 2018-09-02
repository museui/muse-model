import { getObjAttr } from '../utils';

export function watch (path) {
  return (target, name, descriptor) => {
    if (!target._watchs) target._watchs = [];
    target._watchs.push({
      name,
      path
    });
    return descriptor;
  };
}

const watchs = [];
function createWatch ($store, { watchFn, callback }) {
  $store.watch(watchFn, callback);
}

export default {
  modelInit (model, museModel) {
    if (!model._watchs || model._watchs.length === 0) return;
    model._watchs.forEach(({ path, name }) => {
      const item = {
        watchFn: (state) => getObjAttr(state, path),
        callback: (...args) => model[name].apply(model, args)
      };
      if (museModel) {
        createWatch(museModel.$store, item);
      } else {
        watchs.push(item);
      }
    });
  },
  init (museModel) {
    if (watchs.length === 0) return;
    watchs.forEach(item => createWatch(museModel.$store, item));
  }
};
