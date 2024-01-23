<template>
<label>
  {{label}}
  <select v-model="model">
    <slot/>
  </select>
</label>
</template>

<script setup>
defineProps({
  label: String
})

const model = defineModel();
</script>

<style scoped>
label {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

select {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 5px;
  border-radius: 10px;
}
</style>