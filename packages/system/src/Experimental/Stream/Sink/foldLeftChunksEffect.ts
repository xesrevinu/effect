// ets_tracing: off

import type * as CK from "../../../Collections/Immutable/Chunk"
import type * as T from "../../../Effect"
import type * as C from "./core"
import * as DropLeftover from "./dropLeftover"
import * as FoldChunksEffect from "./foldChunksEffect"

/**
 * A sink that effectfully folds its input chunks with the provided function and initial state.
 * `f` must preserve chunking-invariance.
 */
export function foldLeftChunksEffect<R, Err, In, S>(
  z: S,
  f: (s: S, chunk: CK.Chunk<In>) => T.Effect<R, Err, S>
): C.Sink<R, Err, In, Err, unknown, S> {
  return DropLeftover.dropLeftover(
    FoldChunksEffect.foldChunksEffect<R, Err, In, S>(z, (_) => true, f)
  )
}