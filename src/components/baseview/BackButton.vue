<template>
  <div class="button-wrapper">
    <router-link to="/" ref="router">
      <div class="back-button" @click="back"></div>
    </router-link>
  </div>
</template>

<script setup>
import {ref} from "vue";

const router = ref(null);
function back() {
  console.log(router.value);
  router.value.click();
}
</script>

<style scoped>
.back-button {
  width: 40px;
  height: 40px;
  background-color: var(--color-text);
}

.back-button:hover {
  background-color: var(--color-link);
  transition: background-color 0.2s ease-in-out;
}

.button-wrapper {
  position: absolute;
  left: 50px;
  top: 50px;
  clip-path: polygon(40% 0%, 50% 20%, 30% 40%, 100% 40%, 100% 60%, 30% 60%, 50% 80%, 40% 100%, 0% 50%);
}
</style>