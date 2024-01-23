<template>
<label class="info">
  {{label}}
  <input type="text" class="display" disabled :value="Math.round(data * 1e5) / 1e5">
</label>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  label: String,
  data: Number,
});

const data = computed(() => props.data)
</script>

<style scoped>
.info {
  line-height: 1.2rem;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}

.display[type="text"] {
  background-color: var(--color-background);
  line-height: 1.2rem;
  outline: none;
  border: var(--color-text) 1px solid;
  padding: 5px;
  color: var(--color-text);
  border-radius: 10px;
  width: 100px;
}
</style>