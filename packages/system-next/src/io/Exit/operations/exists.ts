import type { Predicate } from "../../../data/Function"
import type { Exit } from "../definition"

/**
 * @tsplus fluent ets/Exit exists
 */
export function exists_<E, A>(self: Exit<E, A>, f: Predicate<A>): boolean {
  switch (self._tag) {
    case "Failure":
      return false
    case "Success":
      return f(self.value)
  }
}

/**
 * @ets_data_first
 */
export function exists<A>(f: Predicate<A>) {
  return <E>(self: Exit<E, A>): boolean => self.exists(f)
}