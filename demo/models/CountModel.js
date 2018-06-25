import { model, getter, action, loading } from '../../src';
import mixin from './mixin';

@model('count', [mixin])
export default class Count {
  state = {
    count: 3,
    list: {
      loading: false
    }
  };

  @action add () {
    return {
      count: this.state.count + 1
    };
  }
  @action sub () {
    return {
      count: this.state.count - 1
    };
  }

  @action addNum (num) {
    this.add();
    return {
      count: this.state.count + num
    };
  }
  @loading('list.loading') @action addTimeOut () {
    return new Promise((res) => {
      setTimeout(() => {
        res({
          count: this.state.count + 1
        });
      }, 2000);
    });
  }

  @getter
  computedCount () {
    return this.state.count + 2;
  }
}
