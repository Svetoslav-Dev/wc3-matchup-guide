// ESM loader hook: resolves "server-only" to a no-op stub in the test runner.
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { shortCircuit: true, url: "data:text/javascript," };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === "data:text/javascript,") {
    return { shortCircuit: true, format: "module", source: "" };
  }
  return nextLoad(url, context);
}
