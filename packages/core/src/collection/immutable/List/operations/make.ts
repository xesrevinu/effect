import type { List } from "../definition"
import { MutableList } from "../definition"

/**
 * Creates a list of the given elements.
 *
 * @complexity O(n)
 * @tsplus static ets/ListOps __call
 */
export function make<A>(...elements: A[]): List<A> {
  const mutableList = MutableList.emptyPushable<A>()
  for (const element of elements) {
    mutableList.push(element)
  }
  return mutableList
}