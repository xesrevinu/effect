import { effect as T } from "@matechs/effect";
import { election, provideClientFactory, provideClientConfig } from "../src";
import { pipe } from "fp-ts/lib/pipeable";

// work in progress
/* istanbul ignore file */

const program = T.forever(
  T.delay(
    T.sync(() => {
      console.log("process!!");
    }),
    3000
  )
);

const main = pipe(
  election("/election/bbbb")(program),
  provideClientFactory,
  provideClientConfig({
    connectionString: "127.0.0.1:2181"
  })
);

const can = T.run(main, ex => {
  console.log(ex);
});

process.on("SIGTERM", () => {
  can();
});
process.on("SIGINT", () => {
  can();
});
