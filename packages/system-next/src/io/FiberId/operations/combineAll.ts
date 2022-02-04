import * as HS from "../../../collection/immutable/HashSet"
import type { FiberId } from "../definition"
import { None } from "../definition"
import { combine_ } from "./combine"

/**
 * Combines a set of `FiberId`s into a single `FiberId`.
 *
 * @tsplus static ets/FiberIdOps combineAll
 */
export function combineAll(fiberIds: HS.HashSet<FiberId>): FiberId {
  return HS.reduce_(fiberIds, new None(), combine_)
}