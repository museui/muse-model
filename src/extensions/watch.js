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

export default {
  registered (model, museModel) {
    if (!model._watchs || model._watchs.length === 0) return;
    const $store = museModel.$store;
    model._watchs.forEach(({ path, name }) => {
      $store.watch(state => getObjAttr(state, path), (...args) => model[name].apply(model, args));
    });
  }
};
