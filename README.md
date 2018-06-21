# muse-model

对vuex功能的一个增强，简化了状态流程的写法。增加按需引入model的控制

## 安装

```bash
npm install muse-model
```

or

```bash
yarn add muse-model
```

## 快速上手

```javascript
// model.js
import Vue from 'vue';
import MuseModel, { createMuseModel } from '../../src';
Vue.use(MuseModel);

export default createMuseModel({
  strict: true
});
```

```javascript
// main.js
import Vue from 'vue';
import store from 'model'; // model.js
import App from './App';

new Vue({
  ...App,
  store
}).$mount('app');
```

```javascript
import { Model } from 'muse-model';
// count.js
export default Model({
  namespace: 'count', // 必须
  state: {
    count: 1
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
  doubleAdd () {
    this.add();
    return {
      count: this.state.count + 1
    }
  },

  addTimeOut () { // 异步处理
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          count: this.state.count + 1
        });
      }, 1000);
    });
  }
});
```

```html
<template>
<div><button @click="addTimeOut()">+</button>{{count}}<button @click="sub()">-</button></div>
</template>
<script>
import Count from './count';

export default {
    connect: Count, // Model / Array<Model> / Function
    created () {
      console.log(this.count);
    }
});
</script>
```

## License

 [MIT](http://opensource.org/licenses/MIT)

 Copyright (c) 2018 myron

