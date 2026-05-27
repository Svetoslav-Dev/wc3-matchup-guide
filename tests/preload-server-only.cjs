"use strict";
// Patches CJS module loading to stub Next.js server-only modules that throw
// outside the request runtime. Does not stub redirect/notFound so tests can
// still assert on NEXT_REDIRECT throws.
const Module = require("module");
const _load = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "server-only") return {};
  if (request === "next/cache") {
    return { revalidateTag: () => {}, revalidatePath: () => {}, unstable_cache: (fn) => fn };
  }
  return _load.apply(this, arguments);
};
