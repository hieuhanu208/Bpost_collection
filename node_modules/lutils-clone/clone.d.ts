function clone(
  object: {},
  options?: {
    depth?: number,
    types?: { object: boolean, array: boolean, function: boolean }
  }
): {}

declare module clone {}

export = clone