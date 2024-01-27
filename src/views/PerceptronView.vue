<template>
{{a.forward(b).tolist()}}
  <br>
{{a.backprop(nj.ones(8))}}
</template>

<script setup>
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
import { Dense } from "@/assets/networks";
import {ref} from "vue";

const a = ref(new Dense(8));
const b = ref(nj.arange(10));
debugger;
a.value.forward(b.value);
console.log(a.value.weights.shape)
a.value.weights = nj.arange(a.value.weights.shape[0] * a.value.weights.shape[1]).reshape(a.value.weights.shape)
</script>

<style scoped>

</style>