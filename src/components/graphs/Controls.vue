<template>
<div class="controls-wrapper card" :class="{ 'wide-flat': wideFlat }">
  <div class="settings">
    <h3>Graph Settings</h3>
    <slot name="graphs"/>
  </div>

  <div class="settings">
    <h3>Model Parameters</h3>
    <slot name="parameters"/>
  </div>

  <div class="settings" v-if="showTraining">
    <h3>Optimizer</h3>
    <slot name="training"/>
  </div>
</div>
</template>

<script setup>
defineProps(["wideFlat", "showTraining"])
</script>

<style scoped>
.wide-flat > .op-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.controls-wrapper {
  width: 30vw;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.controls-wrapper.wide-flat {
  width: 80vw;
  margin-top: 20px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.settings:not(.controls-wrapper:last-child) {
  padding-bottom: 20px;
}

h3 {
  text-decoration: underline;
}
</style>