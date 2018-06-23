import { model, getter, action } from '../../src/decorators';

@model('count')
export default class Count {
  state = {
    count: 3
  }
  @action
  add () {
    return {
      count: this.state.count + 1
    };
  }
  @action
  sub () {
    return {
      count: this.state.count - 1
    };
  }

  @action
  addNum (num) {
    this.add();
    return {
      count: this.state.count + num
    };
  }
  @getter
  computedCount () {
    return this.state.count + 2;
  }
}
