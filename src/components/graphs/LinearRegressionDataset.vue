<template>
  <main class="wrapper card">
    <div class="dataset-graph" ref="graph"></div>
  </main>

  <aside class="wrapper card" v-if="showCost">
    <CostVsSlope2D
        :slope-range="slopeRange"
        :dataset="dataset"
        :slope="slope"
        :cost-function="costFunction"
        :model-slope="modelSlope"
        :modelShown="modelShown"
        :show-tangent-line="showTangentLine"
        v-model:current-cost="cost"
        v-model:derivative="derivative"/>
  </aside>
</template>

<script setup>
import {ref, onMounted, computed, watch, toRaw} from "vue";
import Plotly from 'plotly.js-dist';
import Info from "@/components/graphs/Info.vue";
import CostVsSlope2D from "@/components/graphs/CostVsSlope2D.vue";

const props = defineProps({
  num: Number,
  slope: Number,
  intercept: Number,
  noise: Number,
  slopeRange: Number,
  modelSlope: Number,
  modelIntercept: Number,
  costFunction: String,
  title: String,
  showCost: Boolean,
  showModel: Boolean,
  showTangentLine: Boolean,
  showCostSources: Boolean
})

const cost = defineModel("currentCost");
const derivative = defineModel("derivative");

// canvas
const graph = ref(null);
const num = computed(() => props.num);
const slope = computed(() => props.slope);
const intercept = computed(() => props.intercept);
const noise = computed(() => props.noise);
const domainLimit = ref(1);
const costFunction = computed(() => props.costFunction);

const modelSlope = computed(() => props.modelSlope);
const modelIntercept = computed(() => props.modelIntercept);
const modelShown = computed(() => props.showModel);
const showCostSources = computed(() => props.showCostSources);

const baseLayout = {
  title: props.title,
  xaxis: {
    autorangeoptions: {
      include: 0
    }
  },
  yaxis: {
    autorangeoptions: {
      include: 0
    }
  },
  showlegend: false,
  // shapes: [
  //   {
  //     type: 'rect',
  //     xref: 'x',
  //     yref: 'y',
  //     x0: 0,
  //     y0: 0,
  //     x1: 2,
  //     y1: 2,
  //     fillcolor: '#00ffff',
  //     opacity: 0.2
  //   }
  // ]
}

function randNorm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randNorm() // resample between 0 and 1
  return num
}

function generateDataset() {

  const dataset = []
  for (let i = 0; i < num.value; i++) {
    const x = Math.random() * domainLimit.value;
    const thisNoise = (randNorm() - 0.5) * noise.value;
    dataset.push([
      x,
      slope.value * x + thisNoise + intercept.value
    ])
  }
  return dataset;
}

const dataset = ref(generateDataset());
const datasetXy = computed(() => {
  const x = [],
      y = [];
  for (const [xi, yi] of dataset.value) {
    x.push(xi);
    y.push(yi);
  }
  return [x, y];
})

function generateData() {
  dataset.value = generateDataset();
  const [x, y] = datasetXy.value;

  return {
    x, y,
    type: 'scatter',
    mode: 'markers'
  };
}

function generateModel() {
  return {
    x: [0, 1],
    y: [0, modelSlope.value + modelIntercept.value],
    type: 'scatter',
    mode: 'lines'
  }
}

function insertAt(arr, index, ...items) {
  arr.splice(index, 0, ...items);
}

let generateCostSources = () => {
  const entries = [];
  for (const [x, y] of dataset.value) {
    const predY = x * modelSlope.value + modelIntercept.value;
    if (costFunction.value === "mae") {
      entries.push({
        type: 'scatter',
        x: [x, x],
        y: [predY, y],
        mode: 'lines',
        line: {
          color: 'rgb(61,182,117)'
        }
      })
    } else if (costFunction.value === "mse") {
      entries.push({
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: x,
        y0: y,
        x1: x + Math.abs(predY - y),
        y1: predY,
        fillcolor: 'rgb(61,182,117)',
        opacity: 0.2,
      })
    } else {
      throw Error(costFunction.value);
    }
  }
  return entries;
}

const data = ref(generateData());
const model = ref(generateModel());
let costSources = generateCostSources();

const drawGraph = (() => {
  let drawn = false;
  function drawGraph() {
    console.log("draw dataset");

    const entries = [data.value];
    const layout = {...baseLayout};

    if (modelShown.value === true) {
      entries.push(model.value)
    }

    if (showCostSources.value === true) {
      if (costFunction.value === "mae") {
        insertAt(entries, 0, ...costSources)
      } else if (costFunction.value === "mse") {
        console.log(layout);
        layout["shapes"] = costSources;
        console.log(layout);

      }
    }

    // console.log(entries);

    if (drawn) {
      Plotly.react(graph.value, entries, layout);
      return;
    }

    Plotly.newPlot(
        graph.value,
        entries,
        layout
    )
    drawn = true;
  }

  return drawGraph;
})()

watch([num, noise, slope, intercept, modelIntercept, modelSlope, costFunction], () => {
  data.value = generateData();
  model.value = generateModel();
  if (showCostSources.value === true) {
    costSources = generateCostSources();
  }
  drawGraph();
});
watch(showCostSources, () => {
  if (showCostSources.value === true) {
    costSources = generateCostSources();
  }
  drawGraph();
})
watch(modelShown, () => {
  drawGraph();
})
onMounted(drawGraph);
</script>

<style scoped>
.wrapper {
  display: block;
  max-width: 40vw;
}

.dataset-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 10px;
}

label:not(.dataset-info:last-child) {
  padding-right: 20px;
}

.dataset-graph {
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>