<template>
<div><button @click="addTimeOut(3)">+</button>{{count}}<button @click="sub()">-</button>{{computedCount}} {{msg}} {{list.loading ? 'loading...' : 'loaded'}}</div>
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
