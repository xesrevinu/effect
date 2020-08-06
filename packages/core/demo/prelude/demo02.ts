import { pipe } from "../../src/Function"
import * as A from "../../src/next/Prelude/Array"
import * as Async from "../../src/next/Prelude/Async"
import * as T from "../../src/next/Prelude/Effect"

pipe(
  A.range(0, 10),
  A.Traversable.foreach(Async.ApplicativePar)((n) => T.succeed(n + 1)),
  T.chain((ns) =>
    T.effectTotal(() => {
      console.log(ns)
    })
  ),
  T.runMain
)
