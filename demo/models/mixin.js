export default {
  state: {
    num: 2,
    count: 4
  },
  addDispatch () {
    return {
      count: this.state.count + 1
    };
  },

  addTimeOut () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          count: this.state.count + 1
        });
      }, 1000);
    });
  }
};
