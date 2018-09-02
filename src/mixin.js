import { getMuseModel } from './MuseModel';
import { error, isPlainObject, getMergeOptions } from './utils';

export default {
  beforeCreate () {
    const options = this.$options;
    if (!options.connect) return;
    const museModel = getMuseModel();
    if (!museModel) error('not a MuseModel instance');
    let merge = {};
    switch (true) {
      case typeof options.connect === 'function':
        merge = options.connect((...args) => museModel.getModelMap(...args), model => {
          const actions = {};
          Object.keys(model).forEach(key => {
            if (typeof model[key] !== 'function') return;
            actions[key] = model[key];
          });
          return actions;
        });
        break;
      case Array.isArray(options.connect):
        const maps = museModel.getModelMap.apply(museModel, options.connect);
        merge.computed = {};
        merge.methods = {};
        Object.keys(maps).forEach((key) => {
          const options = getMergeOptions(maps[key]);
          merge.computed = {
            ...merge.computed,
            ...options.computed
          };
          merge.methods = {
            ...merge.methods,
            ...options.methods
          };
        });
        break;
      case isPlainObject(options.connect):
        const map = museModel.getModelMap(options.connect);
        merge = getMergeOptions(map[options.connect.namespace]);
        break;
    }

    options.computed = {
      ...(merge.computed || {}),
      ...options.computed
    };
    options.methods = {
      ...(merge.methods || {}),
      ...options.methods
    };
  }
};
