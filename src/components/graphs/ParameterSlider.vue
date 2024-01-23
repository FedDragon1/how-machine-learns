<template>
<label class="entry">
  <span>{{label}}</span>
  <input type="text" class="display" disabled :value="Math.round(modelValue * 1e5) / 1e5">
  <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      v-model.number="model"
      @input="onChange">
</label>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps(["label", "min", "max", "step", "initial"]);

const model = defineModel();
const modelValue = ref(props.initial)

const onChange = (e) => {
  modelValue.value = Number.parseFloat(e.target.value);
}


// function percentageMapper(min, max) {
//   const toPercentage = (value) => (value - min) / (max - min) * 100;
//   const toValue = (percentage) => min + (max - min) * percentage / 100;
//   return [toPercentage, toValue];
// }

</script>

<style scoped>
span {
  width: 200px;
}

.entry {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.display {
  background-color: var(--color-background);
  line-height: 1.2rem;
  outline: none;
  border: white 1px solid;
  padding: 5px;
  color: white;
  border-radius: 10px;
  width: 100px;
  margin-right: 15px;
}
</style>