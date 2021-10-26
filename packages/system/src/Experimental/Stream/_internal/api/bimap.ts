// ets_tracing: off

import type * as C from "../core"
import * as Map from "./map"
import * as MapError from "./mapError"

/**
 * Returns a stream whose failure and success channels have been mapped by
 * the specified pair of functions, `f` and `g`.
 */
export function bimap_<R, E, E1, A, A1>(
  self: C.Stream<R, E, A>,
  f: (e: E) => E1,
  g: (a: A) => A1
): C.Stream<R, E1, A1> {
  return Map.map_(MapError.mapError_(self, f), g)
}

/**
 * Returns a stream whose failure and success channels have been mapped by
 * the specified pair of functions, `f` and `g`.
 *
 * @ets_data_first bimap_
 */
export function bimap<E, E1, A, A1>(f: (e: E) => E1, g: (a: A) => A1) {
  return <R>(self: C.Stream<R, E, A>) => bimap_(self, f, g)
}