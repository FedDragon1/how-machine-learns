<template>
  <div class="cost-slope-graph" ref="graph"></div>
</template>

<script setup>
import Plotly from 'plotly.js-dist';
import {computed, onMounted, ref, watch} from "vue";

const costFunctions = {
  "mae": (real, pred) => Math.abs(real - pred),
  "mse": (real, pred) => Math.pow(real - pred, 2)
}

const props = defineProps([
    "dataset",
    "slope",
    "slopeRange",
    "costFunction",
    "modelSlope",
    "modelShown",
    "showTangentLine"
])
const cost = defineModel("currentCost");
const derivative = defineModel("derivative");

const totalSamples = ref(100);
const slope = computed(() => props.slope)
const dataset = computed(() => props.dataset);
const precision = computed(() => props.slopeRange * 2 / totalSamples.value);
const costFunction = computed(() => costFunctions[props.costFunction]);
const graph = ref(null);
const modelSlope = computed(() => props.modelSlope);
const modelShown = computed(() => props.modelShown);
const tangentLineShown = computed(() => props.showTangentLine);
const costDataset = ref([]);

getCostDataset();
cost.value = getCostWithSlope(modelSlope.value);
derivative.value = derivativeAt(modelSlope.value);

function getCostWithSlope(slope) {
  let cost = 0;
  for (const [x, y] of dataset.value) {
    const predY = slope * x;
    cost += costFunction.value(y, predY);
  }
  return cost / dataset.value.length;
}

function getCostDataset() {
  const x = [];
  const y = []
  for (let thisSlope = -props.slopeRange; thisSlope <= props.slopeRange; thisSlope += precision.value) {
    x.push(thisSlope);
    y.push(getCostWithSlope(thisSlope));
  }
  costDataset.value = [x, y];
  return [x, y];
}

function getApproxCost(x) {
  // binary search
  let start = 0;
  let end = costDataset.value[0].length - 1;

  while (start < end) {
    let mid = Math.floor((end + start) / 2);
    let midValue = costDataset.value[0][mid];
    if (midValue < x) {
      start = mid + 1;
    } else if (midValue > x) {
      end = mid - 1;
    } else {
      // same
      return costDataset.value[1][mid];
    }
  }

  return costDataset.value[1][start];
}

function getGraphData() {
  const [x, y] = getCostDataset();
  return {
    x,
    y,
    type: 'scatter',
    mode: 'lines'
  }
}

function getModelData() {
  return {
    x: [modelSlope.value, modelSlope.value],
    y: [0, getApproxCost(modelSlope.value)],
    type: 'scatter',
    mode: 'lines'
  }
}

function derivativeAt(x) {
  return (getCostWithSlope(x + precision.value) - getCostWithSlope(x)) / precision.value;
}

function getTangentLine() {
  const point1 = [modelSlope.value, getCostWithSlope(modelSlope.value)];
  const point2 = [modelSlope.value + precision.value, getCostWithSlope(modelSlope.value + precision.value)];
  const slope = (point2[1] - point1[1]) / precision.value;
  const xIntercept = -point1[1] / slope + point1[0];

  const fn = (x) => slope * (x - point1[0]) + point1[1];

  let x1 = xIntercept,
      y1 = 0;
  if (x1 > props.slopeRange) {
    x1 = props.slopeRange;
    y1 = fn(x1);
  } else if (x1 < -props.slopeRange) {
    x1 = -props.slopeRange;
    y1 = fn(x1);
  }

  const x2 = slope >= 0 ? props.slopeRange : -props.slopeRange;
  const y2 = fn(x2);

  return {
    x: [x1, x2],
    y: [y1, y2],
    type: 'scatter',
    mode: 'lines'
  }
}

const layout = {
  title: "Cost vs. Slope",
  xaxis: {
    autorangeoptions: {
      include: props.slopeRange
    },
    title: "slope"
  },
  yaxis: {
    title: "cost"
  },
  showlegend: false
}

const data = ref(getGraphData());
const model = ref(getModelData());
const tangentLine = ref(getTangentLine());

const drawGraph = (() => {
  let drawn = false;
  function drawGraph() {
    console.log("draw cost");

    const entries = [data.value];

    if (modelShown.value === true) {
      entries.push(model.value)
    }

    if (tangentLineShown.value === true) {
      entries.push(tangentLine.value);
    }

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

watch([dataset, precision, costFunction, modelSlope, tangentLineShown], () => {
  data.value = getGraphData();
  model.value = getModelData();
  if (tangentLineShown.value === true) {
    tangentLine.value = getTangentLine();
  }
  cost.value = getCostWithSlope(modelSlope.value);
  derivative.value = derivativeAt(modelSlope.value);
  drawGraph();
});
watch(modelShown, () => {
  drawGraph();
})
onMounted(drawGraph);
</script>

<style scoped>
.cost-slope-graph {
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
}
</style>