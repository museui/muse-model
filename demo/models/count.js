import { Model } from '../../src';
import mixin from './mixin';
export default Model({
  namespace: 'count',
  mixins: [mixin],
  state: {
    count: 1
  },
  getters: {
    computedCount (state) {
      return state.count + 2;
    }
  },
  add () {
    return {
      count: this.state.count + 1
    };
  },

  sub () {
    return {
      count: this.state.count - 1
    };
  },
  addNum (num) {
    return {
      count: this.state.count + num
    };
  }
});
