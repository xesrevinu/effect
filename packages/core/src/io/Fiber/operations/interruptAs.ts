import { Exit } from "../../Exit"
import type { FiberId } from "../../FiberId"
import type { Fiber } from "../definition"
import { done } from "./done"

/**
 * A fiber that is already interrupted.
 */
export function interruptAs(fiberId: FiberId): Fiber<never, never> {
  return done(Exit.interrupt(fiberId))
}