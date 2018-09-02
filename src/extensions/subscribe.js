export function subscrible (path) {
  return (target, name, descriptor) => {
    if (!target._subscribles) target._subscribles = [];
    target._subscribles.push({
      path,
      name
    });
    return descriptor;
  };
}

export default {
  registered (model, museModel) {
    if (!model._subscribles || model._subscribles.length === 0) return;
    const $store = museModel.$store;
    model._subscribles.forEach(({ path, name }) => {
      $store.subscribe(({ type, payload }, state) => {
        if (type === path) return model[name](payload.result, state);
      });
    });
  }
};
