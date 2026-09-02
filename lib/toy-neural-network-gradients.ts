import {
  ToyNetwork,
  ToyPoint,
  cloneToyNetwork,
  forwardToyNetwork,
} from "@/lib/toy-neural-network";

export type ToyGradients = {
  dw1: number[][];
  db1: number[];
  dw2: number[];
  db2: number;
  loss: number;
};

export function computeToyGradients(network: ToyNetwork, dataset: ToyPoint[]): ToyGradients {
  const hidden = network.w1.length;
  const dw1 = Array.from({ length: hidden }, () => [0, 0]);
  const db1 = Array.from({ length: hidden }, () => 0);
  const dw2 = Array.from({ length: hidden }, () => 0);
  let db2 = 0;
  let loss = 0;

  for (const point of dataset) {
    const trace = forwardToyNetwork(network, point.x);
    const p = Math.min(1 - 1e-7, Math.max(1e-7, trace.output));
    loss += -(point.y * Math.log(p) + (1 - point.y) * Math.log(1 - p));

    // BCE + sigmoid output simplifies to dL/dz_out = p - y.
    const outputDelta = trace.output - point.y;
    for (let h = 0; h < hidden; h++) {
      dw2[h] += outputDelta * trace.hiddenA[h];
      const hiddenDelta = outputDelta * network.w2[h] * (1 - trace.hiddenA[h] * trace.hiddenA[h]);
      dw1[h][0] += hiddenDelta * point.x[0];
      dw1[h][1] += hiddenDelta * point.x[1];
      db1[h] += hiddenDelta;
    }
    db2 += outputDelta;
  }

  const n = dataset.length;
  return {
    dw1: dw1.map(row => row.map(value => value / n)),
    db1: db1.map(value => value / n),
    dw2: dw2.map(value => value / n),
    db2: db2 / n,
    loss: loss / n,
  };
}

export function applyToyGradients(network: ToyNetwork, gradients: ToyGradients, learningRate: number): ToyNetwork {
  const next = cloneToyNetwork(network);
  for (let h = 0; h < next.w1.length; h++) {
    next.w1[h][0] -= learningRate * gradients.dw1[h][0];
    next.w1[h][1] -= learningRate * gradients.dw1[h][1];
    next.b1[h] -= learningRate * gradients.db1[h];
    next.w2[h] -= learningRate * gradients.dw2[h];
  }
  next.b2 -= learningRate * gradients.db2;
  return next;
}

export function gradientL2Norm(gradients: ToyGradients) {
  const values = [
    ...gradients.dw1.flat(),
    ...gradients.db1,
    ...gradients.dw2,
    gradients.db2,
  ];
  return Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
}

export type ScalarBackpropTrace = {
  x: number;
  y: 0 | 1;
  w1: number;
  b1: number;
  z1: number;
  a1: number;
  w2: number;
  b2: number;
  z2: number;
  prediction: number;
  loss: number;
  dL_dz2: number;
  dL_dw2: number;
  dL_da1: number;
  da1_dz1: number;
  dL_dz1: number;
  dL_dw1: number;
};

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

export function scalarBackpropTrace(args: {
  x: number;
  y: 0 | 1;
  w1: number;
  b1: number;
  w2: number;
  b2: number;
}): ScalarBackpropTrace {
  const { x, y, w1, b1, w2, b2 } = args;
  const z1 = x * w1 + b1;
  const a1 = Math.tanh(z1);
  const z2 = a1 * w2 + b2;
  const prediction = sigmoid(z2);
  const p = Math.min(1 - 1e-7, Math.max(1e-7, prediction));
  const loss = -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
  const dL_dz2 = prediction - y;
  const dL_dw2 = dL_dz2 * a1;
  const dL_da1 = dL_dz2 * w2;
  const da1_dz1 = 1 - a1 * a1;
  const dL_dz1 = dL_da1 * da1_dz1;
  const dL_dw1 = dL_dz1 * x;
  return {
    x, y, w1, b1, z1, a1, w2, b2, z2, prediction, loss,
    dL_dz2, dL_dw2, dL_da1, da1_dz1, dL_dz1, dL_dw1,
  };
}
