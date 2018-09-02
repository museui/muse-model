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

const subscribles = [];

function createSubscrible ($store, func) {
  $store.subscribe(func);
}

export default {
  modelInit (model, museModel) {
    model._subscribles.forEach(({ path, name }) => {
      const func = ({ type, payload }, state) => {
        if (type === path) return model[name](payload.result, state);
      };
      if (museModel) {
        createSubscrible(museModel.$store, func);
      } else {
        subscribles.push(func);
      }
    });
  },
  init (museModel) {
    if (subscribles.length === 0) return;
    subscribles.forEach(func => createSubscrible(museModel.$store, func));
  }
};
