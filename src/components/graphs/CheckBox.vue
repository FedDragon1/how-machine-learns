<template>
<label class="entry">
  {{label}}
  <input type="checkbox" :checked="initial" :disabled="disabled" v-model="model">
</label>
</template>

<script setup>
defineProps(["label", "initial", "disabled"]);

const model = defineModel();
</script>

<style scoped>
.entry {
}
</style>