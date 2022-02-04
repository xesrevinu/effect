import { Either } from "../../../data/Either"
import type { Option } from "../../../data/Option"
import { FiberId } from "../../FiberId"
import { Effect } from "../definition"
import type { Cb } from "./Cb"

/**
 * Imports an asynchronous effect into a pure `ZIO` value, possibly returning
 * the value synchronously.
 *
 * If the register function returns a value synchronously, then the callback
 * function `ZIO[R, E, A] => Any` must not be called. Otherwise the callback
 * function must be called at most once.
 *
 * @tsplus static ets/EffectOps asyncMaybe
 */
export function asyncMaybe<R, E, A>(
  register: (callback: Cb<Effect<R, E, A>>) => Option<Effect<R, E, A>>,
  __etsTrace?: string
): Effect<R, E, A> {
  return asyncMaybeBlockingOn(register, FiberId.none)
}

/**
 * Imports an asynchronous effect into a pure `ZIO` value, possibly returning
 * the value synchronously.
 *
 * If the register function returns a value synchronously, then the callback
 * function `ZIO[R, E, A] => Any` must not be called. Otherwise the callback
 * function must be called at most once.
 *
 * The list of fibers, that may complete the async callback, is used to
 * provide better diagnostics.
 *
 * @tsplus static ets/EffectOps asyncMaybeBlockingOn
 */
export function asyncMaybeBlockingOn<R, E, A>(
  register: (callback: Cb<Effect<R, E, A>>) => Option<Effect<R, E, A>>,
  blockingOn: FiberId,
  __etsTrace?: string
): Effect<R, E, A> {
  return Effect.asyncInterruptBlockingOn((cb) => {
    const result = register(cb)
    switch (result._tag) {
      case "None":
        return Either.left(Effect.unit)
      case "Some":
        return Either.right(result.value)
    }
  }, blockingOn)
}