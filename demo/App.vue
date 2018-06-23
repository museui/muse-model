<template>
<div><button @click="addNum(3)">+</button>{{count}}<button @click="sub()">-</button>{{computedCount}}</div>
</template>
<script>
import Count from './models/CountModel';
export default {
  name: 'App',
  connect: Count,
  created () {
  }
};
</script>
