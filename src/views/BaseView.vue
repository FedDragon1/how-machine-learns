<script setup>
import HelloWorld from '@/components/baseview/HelloWorld.vue'
import TheWelcome from '@/components/baseview/TheWelcome.vue'
</script>

<template>
  <div class="wrapper">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="Simulations" />
      </div>
    </header>

    <main>
      <TheWelcome />
    </main>
  </div>
</template>

<script>
export default {
  name: "BaseView"
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

.wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  max-width: 80vw;
}
</style>