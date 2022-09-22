import { expose } from "comlink";

async function fetch_params() {
  const response = await fetch("http://localhost:3000/params.bin");
  const bytes = await response.arrayBuffer();
  const params = new Uint8Array(bytes);
  return params;
}

async function prove_fib() {
  const params = await fetch_params();
  console.log("param length", params.length);
  console.log("params", params);
  const multiThread = await import("halowasm");
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);
  multiThread.init_panic_hook();

  console.log("genning proof");

  const ret = multiThread.prove_fib(BigInt(1), BigInt(1), params);
  return ret;
}

const exports = {
  prove_fib,
};
export type HaloWorker = typeof exports;

expose(exports);
