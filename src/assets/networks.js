import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';

// utils

function outer(a, b) {
    // outer product of vector a and b
    const ret = [];
    for (const ai of a.tolist()) {
        const row = [];
        for (const bi of b.tolist()) {
            row.push(ai * bi);
        }
        ret.push(row);
    }
    return nj.array(ret);
}

function maximum(arr, num) {
    const ret = [];
    for (const i of arr.tolist()) {
        ret.push(i > num ? i : num);
    }
    return nj.array(ret);
}

function maximumVec(arr1, arr2) {
    const ret = [];
    const list1 = arr1.tolist();
    const list2 = arr2.tolist();
    for (let i = 0; i < list1.length; i++) {
        ret.push(list1[i] > list2[i] ? list1[i] : list2[i]);
    }
    return nj.array(ret);
}

// layers

export class Layer {
    // Base Layer Definition

    constructor(outputShape, inputShape) {
        this.built = false;
        this.outputShape = outputShape;
        this.inputShape = inputShape;
        this.nParam = 0;
    }

    forward(neurons) {
        neurons = nj.array(neurons);
        this.input = neurons;
        if (!this.built) {
            this.buildParameters(neurons);
        }
        this.output = this.getOutput(neurons).clone();
        return this.output;
    }

    getOutput(neurons) {
        throw Error("Abstract method");
    }

    backprop(gradients) {
        throw Error("Abstract method");
    }

    buildParameters(neurons) {
        throw Error("Abstract method");
    }

    getTrainable() {
        return {};
    }
}

export class Dense extends Layer{
    constructor(outputShape) {
        super(outputShape);
    }

    getOutput(neurons) {
        return this.weights.dot(neurons).add(this.biases, false);
    }

    buildParameters(neurons) {
        if (neurons.shape.length !== 1) {
            throw Error(`Incompatible Shape ${neurons.shape}. Expected shape to be 1D.`)
        }

        this.inputShape = neurons.shape[0];
        this.weights = nj.random([this.outputShape, this.inputShape]).subtract(0.5, false);
        this.biases = nj.zeros(this.outputShape);

        this.nParam = this.outputShape * this.inputShape + this.outputShape;
        this.built = true;
    }

    backprop(gradients) {
        // trainable parameters
        const nablaW = outer(gradients, this.input);
        const nablaB = gradients.clone();

        // gradient passing on backprop
        const nablaA = gradients.T.dot(this.weights);

        const trainable = {"weights": nablaW, "biases": nablaB};
        return [trainable, nablaA];
    }
}


class BaseActivation extends Layer {
    constructor() {
        super();
    }

    buildParameters(neurons) {
        this.inputShape = this.outputShape = nj.array(neurons);
        this.built = true;
    }
}


class ReLU extends BaseActivation {
    getOutput(neurons) {
        return maximum(neurons, 0);
    }

    backprop(gradients) {
        const grad = [];
        for (const i of gradients.tolist()) {
            grad.push(i >= 0 ? 1 : 0);
        }
        return [{}, nj.array(grad)];
    }
}

class LeakyReLU extends BaseActivation {
    constructor(leak) {
        super();
        if (typeof leak === "number") {
            this.leak = leak;
        } else {
            this.leak = 0.01;
        }
    }

    getOutput(neurons) {
        return maximumVec(neurons.multiply(this.leak), neurons);
    }

    backprop(gradients) {
        const grad = []
        for (const entry of gradients) {
            grad.push(entry > 0 ? 1 : this.leak);
        }
        return [{}, nj.array(grad).multiply(gradients)]
    }
}

class SoftMax extends BaseActivation {
    getOutput(neurons) {
        neurons = neurons.subtract(nj.max(neurons));
        const exp_arr = nj.exp(neurons);
        return exp_arr.divide(nj.sum(exp_arr));
    }

    getTrainable() {
        const jacobian = nj.diag(this.output).subtract(outer(this.output, this.output));
        return [{}, jacobian];
    }
}

class Sigmoid extends BaseActivation {
    getOutput(neurons) {
        return nj.ones(neurons.shape).divide(nj.exp(neurons.negative()).add(1));
    }

    backprop(gradients) {
        const grad = this.output.multiply(this.output.negative().add(1));
        return [{}, gradients.multiply(grad)];
    }
}

class Tanh extends BaseActivation {
    getOutput(neurons) {
        return nj.tanh(neurons);
    }

    backprop(gradients) {
        const grad = this.output.pow(2).negative().add(1);
        return [{}, gradients.multiply(grad)];
    }
}
