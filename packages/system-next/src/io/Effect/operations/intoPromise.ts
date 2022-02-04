import type { LazyArg } from "../../../data/Function"
import type { Promise } from "../../Promise"
import type { RIO } from "../definition"
import { Effect } from "../definition"

/**
 * Returns an effect that keeps or breaks a promise based on the result of
 * this effect. Synchronizes interruption, so if this effect is interrupted,
 * the specified promise will be interrupted, too.
 *
 * @tsplus fluent ets/Effect intoPromise
 */
export function intoPromise_<R, E, A>(
  self: Effect<R, E, A>,
  promise: LazyArg<Promise<E, A>>,
  __etsTrace?: string
): RIO<R, boolean> {
  return Effect.uninterruptibleMask(({ restore }) =>
    restore(self)
      .exit()
      .flatMap((exit) => promise().done(exit))
  )
}

/**
 * Returns an effect that keeps or breaks a promise based on the result of
 * this effect. Synchronizes interruption, so if this effect is interrupted,
 * the specified promise will be interrupted, too.
 *
 * @ets_data_first intoPromise_
 */
export function intoPromise<E, A>(
  promise: LazyArg<Promise<E, A>>,
  __etsTrace?: string
) {
  return <R>(self: Effect<R, E, A>): RIO<R, boolean> => self.intoPromise(promise)
}