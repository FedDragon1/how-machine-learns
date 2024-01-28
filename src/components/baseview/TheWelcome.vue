<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from '../icons/IconDocumentation.vue'
import ToolingIcon from '../icons/IconTooling.vue'
import EcosystemIcon from '../icons/IconEcosystem.vue'
import CommunityIcon from '../icons/IconCommunity.vue'
import SupportIcon from '../icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Best Fit Slope</template>

    This <router-link to="/best_slope">simulation</router-link>
    will walk over the essentials of single variable optimization,
    including <b>Cost Functions</b>, <b>Parameter</b>, <b>Epochs</b>, etc.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Multivariable Optimization</template>

    Single variable optimization is quite easy... What about if we consider both
    slope and the y-intercept? This <router-link to="/linear_regression">linear regression simulation</router-link>
    will walk through differences of multivariable optimization.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Training Model</template>

    But how can we train the complex function into a meaningful model that captures
    pattern? This <a href="https://playground.tensorflow.org/">backpropagation & gradient descent</a>
    simulation dissects the process of training a model.
  </WelcomeItem>
</template>
