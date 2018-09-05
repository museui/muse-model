import loadingExtension, { loading } from './loading';
import watchExtension, { watch } from './watch';
import subscribeExension, { subscribe } from './subscribe';
// import formExension from './form';

export const extensions = [
  loadingExtension,
  watchExtension,
  subscribeExension
  // formExension
];

export function callHook (name, ...args) {
  extensions.forEach(extension => {
    if (!extension[name]) return;
    extension[name].apply(extension, args);
  });
}

export function generateMutations () {
  let results = {};
  extensions.forEach(({ mutations }) => {
    results = {
      ...results,
      ...mutations
    };
  });
  return results;
}
export { loading, watch, subscribe };
