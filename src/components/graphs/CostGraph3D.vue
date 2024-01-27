<template>
  <div class="cost-slope-graph" ref="graph"></div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import Plotly from "plotly.js-dist";
import {slope} from "plotly.js/src/components/shapes/label_texttemplate";

const costFunctions = {
  "mae": (real, pred) => Math.abs(real - pred),
  "mse": (real, pred) => Math.pow(real - pred, 2)
}

const props = defineProps([
  "dataset",
  "slope",
  "intercept",
  "slopeRange",
  "interceptRange",
  "costFunction",
  "modelSlope",
  "modelIntercept",
  "modelShown",
  "showTangentLine"
])

// models
const cost = defineModel("currentCost");
const gradient = defineModel("gradient");

// hyper-parameters
const modelShown = computed(() => props.modelShown);
const tangentLineShown = computed(() => props.showTangentLine);
const costFunction = computed(() => costFunctions[props.costFunction]);
const dataset = computed(() => props.dataset);
const dataSlope = computed(() => props.slope);
const dataIntercept = computed(() => props.intercept);

// parameters
const modelSlope = computed(() => props.modelSlope);
const modelIntercept = computed(() => props.modelIntercept);

// graph
const totalSamples = ref(25);
const interceptPrecision = computed(() => props.interceptRange / totalSamples.value * 2);
const slopePrecision = computed(() => props.slopeRange / totalSamples.value * 2);
const costDataset = ref([]);
const layout = {
  title: "Cost vs. Slope",
  scene: {
    xaxis: {
      autorangeoptions: {
        include: props.slopeRange
      },
      title: {
        text: "slope"
      }
    },
    yaxis: {
      title: "intercept"
    },
    zaxis: {
      title: "cost"
    }
  },
  showlegend: false
}
const data = ref(getGraphData());
const model = ref(getModelData());
const tangentLine = ref(getTangentLine());
const graph = ref(null);

gradient.value = gradientAt(modelSlope.value, modelIntercept.value);

function getCost(slope, intercept) {
  let cost = 0;
  for (const [x, y] of dataset.value) {
    const predY = slope * x + intercept;
    cost += costFunction.value(y, predY);
  }
  return cost / dataset.value.length;
}

function getCostDataset() {
  const x = [];
  const y = [];
  const z = [];
  for (let iSlope = -props.slopeRange;
       iSlope <= props.slopeRange + slopePrecision.value / 2;
       iSlope += slopePrecision.value) {
    const xTemp = [];
    const yTemp = [];
    const zTemp = [];
    for (let iInt = -props.interceptRange;
         iInt <= props.interceptRange + slopePrecision.value / 2;
         iInt += interceptPrecision.value) {
      xTemp.push(iSlope);
      yTemp.push(iInt)
      zTemp.push(getCost(iSlope, iInt));
    }
    x.push(xTemp);
    y.push(yTemp);
    z.push(zTemp);
  }
  costDataset.value = [x, y, z];
  return [x, y, z];
}

function getGraphData() {
  const [x, y, z] = getCostDataset();
  return {
    x,
    y,
    z,
    type: 'surface',
    opacity: 0.8
  }
}

function gradientAt(x, y) {
  console.log(x, y);
  const dfdx = (getCost(x + slopePrecision.value, y) - getCost(x, y)) / slopePrecision.value;
  const dfdy = (getCost(x, y + interceptPrecision.value) - getCost(x, y)) / interceptPrecision.value;
  return [dfdx, dfdy];
}

function getModelData() {
  return {
    x: [modelSlope.value, modelSlope.value],
    y: [modelIntercept.value, modelIntercept.value],
    z: [props.costFunction === "mse" ? -10 : -2, getCost(modelSlope.value, modelIntercept.value)],
    type: 'scatter3d',
    mode: 'lines',
    line: {
      width: 10
    }
  }
}

function getTangentLine() {
  // x
  let point1 = [
    modelSlope.value,
    modelIntercept.value,
    getCost(modelSlope.value, modelIntercept.value)
  ];
  let point2 = [
      modelSlope.value + slopePrecision.value,
      modelIntercept.value,
      getCost(modelSlope.value + slopePrecision.value, modelIntercept.value)
  ];
  const dfdx = (point2[2] - point1[2]) / slopePrecision.value;
  const xIntercept = -point1[2] / dfdx + point1[0];
  let fn = (x) => dfdx * (x - point1[0]) + point1[2];

  let x1 = xIntercept,
      z1 = 0;
  if (x1 > props.slopeRange) {
    x1 = props.slopeRange;
    z1 = fn(x1);
  } else if (x1 < -props.slopeRange) {
    x1 = -props.slopeRange;
    z1 = fn(x1);
  }
  let x2 = dfdx >= 0 ? props.slopeRange: -props.slopeRange;
  let z2 = fn(x2);
  const partialSlope = {
    x: [x1, x2],
    y: [modelIntercept.value, modelIntercept.value],
    z: [z1, z2],
    type: 'scatter3d',
    mode: 'lines',
    line: {
      width: 5
    }
  }

  point2 = [
    modelSlope.value,
    modelIntercept.value + interceptPrecision.value,
    getCost(modelSlope.value, modelIntercept.value + interceptPrecision.value)
  ];
  const dfdy = (point2[2] - point1[2]) / modelIntercept.value;
  const yIntercept = -point1[2] / dfdy + point1[1];
  fn = (y) => dfdy * (y - point1[1]) + point1[2];

  let y1 = yIntercept;
    z1 = 0;
  if (y1 > props.interceptRange) {
    y1 = props.interceptRange;
    z1 = fn(y1);
  } else if (y1 < -props.interceptRange) {
    y1 = -props.interceptRange;
    z1 = fn(y1);
  }
  let y2 = dfdx >= 0 ? props.interceptRange: -props.interceptRange;
  z2 = fn(y2);
  const partialIntercept = {
    x: [modelSlope.value, modelSlope.value],
    y: [y1, y2],
    z: [z1, z2],
    type: 'scatter3d',
    mode: 'lines',
    line: {
      width: 5
    }
  }

  return [partialSlope, partialIntercept];
}

const drawGraph = (() => {
  let drawn = false;
  function drawGraph() {
    console.log("draw");

    const entries = [data.value];

    if (modelShown.value === true) {
      entries.push(model.value);
    }

    if (tangentLineShown.value === true) {
      entries.push(...tangentLine.value);
    }

    if (drawn) {
      Plotly.react(graph.value, entries, layout);
      return;
    }

    Plotly.newPlot(graph.value, entries, layout);
    drawn = true;
  }
  return drawGraph;
})();

watch([
  dataset,
  modelSlope,
  modelIntercept,
  dataSlope,
  dataIntercept,
  costFunction
], () => {
  console.log(gradientAt(modelSlope.value, modelIntercept.value));
  data.value = getGraphData();
  model.value = getModelData();
  if (tangentLineShown.value === true) {
    tangentLine.value = getTangentLine();
  }
  drawGraph();
  cost.value = getCost(modelSlope.value, modelIntercept.value);
  gradient.value = gradientAt(modelSlope.value, modelIntercept.value);
});
watch(modelShown, () => {
  drawGraph();
})
watch(tangentLineShown, () => {
  if (tangentLineShown.value === true) {
    tangentLine.value = getTangentLine();
  }
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