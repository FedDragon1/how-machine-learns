<template>
  <div class="wrapper">
      <LinearRegressionDataset
          :noise="noiseRange"
          :num="dataNum"
          :intercept="0"
          :slope="dataSlope"
          :show-cost="showCostGraph"
          :slope-range="slopeRange"
          :cost-function="costFunctionName"
          :show-model="showModel"
          :model-slope="modelSlope"
          :show-cost-sources="showCostSources"
          :model-intercept="0"
          v-model:dataset="dataset"
          title="Find Best Slope">
        <CostGraph2D
            :slope-range="slopeRange"
            :slope="dataSlope"
            :cost-function="costFunctionName"
            :model-slope="modelSlope"
            :modelShown="showModel"
            :show-tangent-line="showTangentLine"
            :dataset="dataset"
            v-model:current-cost="currentCost"
            v-model:derivative="derivative"/>
      </LinearRegressionDataset>

    <Controls :wide-flat="showCostGraph" :show-training="showCostGraph">
      <template #graphs>
        <ParameterSlider
            label="Data Points"
            :initial="dataNum"
            :min="1"
            :max="100"
            v-model="dataNum"/>
        <ParameterSlider
            label="Noise Scale"
            :initial="noiseScale"
            :min="0"
            :max="1"
            step="0.01"
            v-model="noiseScale"/>
        <ParameterSlider
            label="Generation Slope"
            :initial="dataSlope"
            :min="-slopeRange"
            :max="slopeRange "
            step="0.1"
            v-model="dataSlope"/>
        <div class="checkbox-group">
          <CheckBox label="Show Cost vs. Slope" :initial="showCostGraph" v-model="showCostGraph"/>
          <CheckBox label="Show Model" :initial="showModel" v-model="showModel"/>
        </div>
      </template>
      <template #parameters>
        <ParameterSlider
            label="Model Slope"
            :initial="modelSlope"
            :min="-slopeRange"
            :max="slopeRange"
            step="0.1"
            v-model="modelSlope"/>
        <Selection label="Cost Function" v-model="costFunctionName">
          <option v-for="(name, key) in costFunctions" :key="key" :value="key">{{name}}</option>
        </Selection>
        <div class="checkbox-group">
          <CheckBox
              label="Show Cost Sources"
              :disabled="!showModel"
              :initial="showCostSources"
              v-model="showCostSources"/>
          <CheckBox
              label="Show Tangent Line"
              :disabled="!showModel || !showCostGraph"
              :initial="showTangentLine"
              v-model="showTangentLine"/>
        </div>
        <button
            type="button"
            v-if="showCostGraph"
            @click.prevent="optimizeBegin"
            :disabled="optimizing">Optimize</button>
      </template>
      <template #training>
        <ParameterSlider
          label="Epochs"
          :initial="epochs"
          :min="1"
          :max="100"
          v-model="epochs"/>
        <ParameterSlider
            label="Learning Rate"
            :initial="learningRate"
            :min="0"
            :max="0.1"
            step="0.001"
            v-model="learningRate"/>
        <Info
          label="Current Cost"
          :data="currentCost"/>
        <Info
          label="Cost Optimized"
          :data="costOptimized"/>
      </template>
    </Controls>
  </div>

</template>

<script setup>
import LinearRegressionDataset from "@/components/graphs/LinearRegressionDataset.vue";
import ParameterSlider from "@/components/graphs/ParameterSlider.vue";
import Controls from "@/components/graphs/Controls.vue";
import {computed, ref, watch} from "vue";
import CheckBox from "@/components/graphs/CheckBox.vue";
import Selection from "@/components/graphs/Selection.vue";
import Info from "@/components/graphs/Info.vue";
import CostVsSlope2D from "@/components/graphs/CostGraph2D.vue";
import {data} from "plotly.js/src/plots/frame_attributes";
import CostGraph2D from "@/components/graphs/CostGraph2D.vue";

const costFunctions = {
  "mae": "Mean Absolute Error",
  "mse": "Mean Squared Error"
}

const dataset = ref([]);
const dataNum = ref(10);
const slopeRange = ref(4);
const noiseScale = ref(0.5);
const noiseRange = computed(() => slopeRange.value * noiseScale.value);
const dataSlope = ref((Math.random() - 0.5) * 2 * slopeRange.value);
const modelSlope = ref((Math.random() - 0.5) * 2 * slopeRange.value);
const costFunctionName = ref("mse");
const currentCost = ref(0);
const costOptimized = ref(0);

const showCostGraph = ref(false);
const showModel = ref(false);
const showCostSources = ref(false);
const showTangentLine = ref(false);

const epochs = ref(0);
const optimizing = ref(false);
const costBefore = ref(0);
const derivative = ref(0);
const learningRate = ref(0.03);

function optimizeBegin() {
  optimizing.value = true;
  costBefore.value = currentCost.value;
  optimizeStep(epochs.value);
}

function optimizeStep(remainingStep) {
  if (remainingStep === 0) {
    optimizeCleanUp();
    return;
  }

  const movement = derivative.value * learningRate.value;
  modelSlope.value -= movement;

  requestIdleCallback(() => optimizeStep(remainingStep - 1), { timeout: 100 });
}

function optimizeCleanUp() {
  costOptimized.value = currentCost.value - costBefore.value;
  costBefore.value = currentCost.value;
  optimizing.value = false;
}

watch(showModel, (value) => {
  if (value === false) {
    showTangentLine.value = false;
    showCostSources.value = false;
  }
})
watch(showCostGraph, (value) => {
  if (value === false) {
    showTangentLine.value = false;
  }
})
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.wrapper {
  height: 100vh;
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
}

button {
  background-color: var(--color-background-mute);
  outline: none;
  border: 1px solid white;
  padding: 5px 10px;
  border-radius: 10px;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: var(--color-border-hover);
}

button:disabled {
  background-color: var(--color-background);
  color: grey;
  border: 1px solid grey;
}
</style>