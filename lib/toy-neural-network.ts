export type ToyPoint = { x: [number, number]; y: 0 | 1; label?: string };

export type ToyNetwork = {
  w1: number[][]; // hidden x input
  b1: number[];
  w2: number[]; // hidden -> output
  b2: number;
};

export type ForwardTrace = {
  input: [number, number];
  hiddenZ: number[];
  hiddenA: number[];
  outputZ: number;
  output: number;
};

function mulberry32(seed: number) {
  return () => {
    let t = seed += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createToyNetwork(seed = 42, hidden = 4): ToyNetwork {
  const random = mulberry32(seed);
  const rand = () => (random() * 2 - 1) * 0.9;
  return {
    w1: Array.from({ length: hidden }, () => [rand(), rand()]),
    b1: Array.from({ length: hidden }, () => rand() * 0.2),
    w2: Array.from({ length: hidden }, () => rand()),
    b2: rand() * 0.2,
  };
}

export function cloneToyNetwork(network: ToyNetwork): ToyNetwork {
  return {
    w1: network.w1.map(row => [...row]),
    b1: [...network.b1],
    w2: [...network.w2],
    b2: network.b2,
  };
}

export function sigmoid(value: number) {
  if (value >= 0) {
    const z = Math.exp(-value);
    return 1 / (1 + z);
  }
  const z = Math.exp(value);
  return z / (1 + z);
}

export function forwardToyNetwork(network: ToyNetwork, input: [number, number]): ForwardTrace {
  const hiddenZ = network.w1.map((weights, index) => weights[0] * input[0] + weights[1] * input[1] + network.b1[index]);
  const hiddenA = hiddenZ.map(Math.tanh);
  const outputZ = hiddenA.reduce((sum, activation, index) => sum + activation * network.w2[index], network.b2);
  const output = sigmoid(outputZ);
  return { input, hiddenZ, hiddenA, outputZ, output };
}

export function binaryCrossEntropy(prediction: number, target: 0 | 1) {
  const p = Math.min(1 - 1e-7, Math.max(1e-7, prediction));
  return -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
}

export function datasetLoss(network: ToyNetwork, dataset: ToyPoint[]) {
  return dataset.reduce((sum, point) => sum + binaryCrossEntropy(forwardToyNetwork(network, point.x).output, point.y), 0) / dataset.length;
}

export function trainToyEpoch(network: ToyNetwork, dataset: ToyPoint[], learningRate = 0.2): ToyNetwork {
  const next = cloneToyNetwork(network);
  const hidden = next.w1.length;
  const dw1 = Array.from({ length: hidden }, () => [0, 0]);
  const db1 = Array.from({ length: hidden }, () => 0);
  const dw2 = Array.from({ length: hidden }, () => 0);
  let db2 = 0;

  for (const point of dataset) {
    const trace = forwardToyNetwork(next, point.x);
    const outputDelta = trace.output - point.y; // sigmoid + BCE derivative
    for (let h = 0; h < hidden; h++) {
      dw2[h] += outputDelta * trace.hiddenA[h];
      const hiddenDelta = outputDelta * next.w2[h] * (1 - trace.hiddenA[h] * trace.hiddenA[h]);
      dw1[h][0] += hiddenDelta * point.x[0];
      dw1[h][1] += hiddenDelta * point.x[1];
      db1[h] += hiddenDelta;
    }
    db2 += outputDelta;
  }

  const scale = learningRate / dataset.length;
  for (let h = 0; h < hidden; h++) {
    next.w2[h] -= scale * dw2[h];
    next.w1[h][0] -= scale * dw1[h][0];
    next.w1[h][1] -= scale * dw1[h][1];
    next.b1[h] -= scale * db1[h];
  }
  next.b2 -= scale * db2;
  return next;
}

export function trainToyNetwork(network: ToyNetwork, dataset: ToyPoint[], epochs: number, learningRate = 0.2): ToyNetwork {
  let current = cloneToyNetwork(network);
  for (let epoch = 0; epoch < epochs; epoch++) current = trainToyEpoch(current, dataset, learningRate);
  return current;
}

export const XOR_DATASET: ToyPoint[] = [
  { x: [0.08, 0.08], y: 0, label: "BLOOP" },
  { x: [0.18, 0.2], y: 0, label: "BLOOP" },
  { x: [0.82, 0.82], y: 0, label: "BLOOP" },
  { x: [0.92, 0.72], y: 0, label: "BLOOP" },
  { x: [0.08, 0.88], y: 1, label: "ZING" },
  { x: [0.2, 0.72], y: 1, label: "ZING" },
  { x: [0.82, 0.12], y: 1, label: "ZING" },
  { x: [0.94, 0.24], y: 1, label: "ZING" },
];
