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
      <DocumentationIcon />
    </template>
    <template #heading>What is Learning?</template>

    This
    <router-link to="/learn">page</router-link>
    provides you with all information you need to get started.
  </WelcomeItem>

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
      <CommunityIcon />
    </template>
    <template #heading>Multilayer Perception</template>

    Linear regression is still not complicated enough to conquer meaningful
    problems... This <router-link to="/mlp">multilayer perceptron</router-link>
    sandbox is perfect for constructing a complex model to be trained.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Training Model</template>

    But how can we train the complex function into a meaningful model that captures
    pattern? This <router-link to="/backprop">backpropagation & gradient descent</router-link>
    simulation dissects the process of training a model.
  </WelcomeItem>
</template>
