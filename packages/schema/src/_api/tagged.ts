import * as Chunk from "@effect-ts/core/Collections/Immutable/Chunk"
import { pipe } from "@effect-ts/system/Function"

import type { TaggedUnionE } from "../_schema"
import * as S from "../_schema"
import * as Arbitrary from "../Arbitrary"
import * as Encoder from "../Encoder"
import * as Guard from "../Guard"
import * as Parser from "../Parser"
import * as Th from "../These"
import { literal } from "./literal"

export interface TagApi<K> {
  value: K
}

export function tag<K extends string>(
  _tag: K
): S.Schema<
  unknown,
  S.RefinementE<S.LeafE<S.LiteralE<[K]>>>,
  K,
  K,
  never,
  K,
  string,
  TagApi<K>
> {
  return literal(_tag)["|>"](S.mapApi((_) => ({ value: _tag })))
}

type SchemaK<Key extends string, N extends string> = S.Schema<
  unknown,
  any,
  any,
  any,
  { readonly [K in Key]: N },
  any,
  any,
  {
    fields: {
      [K in Key]: TagApi<N>
    }
  }
>

export interface LiteralApi__<KS extends readonly string[], AS extends KS[number]> {
  readonly matchS: <A>(
    _: {
      [K in KS[number]]: (_: K) => A
    }
  ) => (ks: AS) => A
  readonly matchW: <
    M extends {
      [K in KS[number]]: (_: K) => any
    }
  >(
    _: M
  ) => (
    ks: AS
  ) => {
    [K in keyof M]: ReturnType<M[K]>
  }[keyof M]
}

export type TaggedApi<
  Key extends string,
  Props extends readonly SchemaK<Key, string>[]
> = {
  readonly matchS: <A>(
    _: {
      [K in Props[number]["Api"]["fields"][Key]["value"]]: (
        _: Extract<
          {
            [K in keyof Props]: Props[K] extends S.SchemaAny
              ? S.ParsedShapeOf<Props[K]>
              : never
          }[number],
          {
            [k in Key]: K
          }
        >
      ) => A
    }
  ) => (
    ks: {
      [K in keyof Props]: Props[K] extends S.SchemaAny
        ? S.ParsedShapeOf<Props[K]>
        : never
    }[number]
  ) => A
  readonly matchW: <
    M extends {
      [K in Props[number]["Api"]["fields"][Key]["value"]]: (
        _: Extract<
          {
            [K in keyof Props]: Props[K] extends S.SchemaAny
              ? S.ParsedShapeOf<Props[K]>
              : never
          }[number],
          {
            [k in Key]: K
          }
        >
      ) => any
    }
  >(
    _: M
  ) => (
    ks: {
      [K in keyof Props]: Props[K] extends S.SchemaAny
        ? S.ParsedShapeOf<Props[K]>
        : never
    }[number]
  ) => {
    [K in keyof M]: ReturnType<M[K]>
  }[keyof M]
}

export function makeTagged<Key extends string>(key: Key) {
  return <Props extends readonly SchemaK<Key, string>[]>(
    ...props: Props
  ): S.Schema<
    unknown,
    S.CompositionE<
      | S.PrevE<S.LeafE<S.TaggedUnionExtractKeyE>>
      | S.NextE<
          TaggedUnionE<
            {
              [K in keyof Props]: Props[K] extends S.SchemaAny
                ? S.TaggedUnionMemberE<
                    S.ParsedShapeOf<Props[K]>[Key],
                    S.ParserErrorOf<Props[K]>
                  >
                : never
            }[number]
          >
        >
    >,
    {
      [K in keyof Props]: Props[K] extends S.SchemaAny
        ? S.ParsedShapeOf<Props[K]>
        : never
    }[number],
    {
      [K in keyof Props]: Props[K] extends S.SchemaAny
        ? S.ConstructorInputOf<Props[K]>
        : never
    }[number],
    TaggedUnionE<
      {
        [K in keyof Props]: Props[K] extends S.SchemaAny
          ? S.TaggedUnionMemberE<
              S.ConstructedShapeOf<Props[K]>[Key],
              S.ConstructorErrorOf<Props[K]>
            >
          : never
      }[number]
    >,
    {
      [K in keyof Props]: Props[K] extends S.SchemaAny
        ? S.ConstructedShapeOf<Props[K]>
        : never
    }[number],
    {
      [K in keyof Props]: Props[K] extends S.SchemaAny ? S.EncodedOf<Props[K]> : never
    }[number],
    TaggedApi<Key, Props>
  > => {
    const propsObj = {}
    const guards = {}
    const parsers = {}
    const encoders = {}
    const arbitraries = [] as Arbitrary.Gen<unknown>[]
    const keys = [] as string[]

    for (const p of props) {
      propsObj[p.Api.fields[key].value] = p
      guards[p.Api.fields[key].value] = Guard.for(p)
      parsers[p.Api.fields[key].value] = Parser.for(p)
      encoders[p.Api.fields[key].value] = Encoder.for(p)
      arbitraries.push(Arbitrary.for(p))
      keys.push(p.Api.fields[key].value)
    }

    const guard = (
      u: unknown
    ): u is {
      [K in keyof Props]: Props[K] extends S.SchemaAny
        ? S.ParsedShapeOf<Props[K]>
        : never
    }[number] => {
      if (typeof u === "object" && u != null && key in u) {
        const tag = u[key as string]
        const memberGuard = guards[tag]

        if (memberGuard) {
          return memberGuard(u)
        }
      }
      return false
    }

    return pipe(
      S.identity(guard),
      S.arbitrary(
        (_) =>
          _.oneof(...arbitraries.map((f) => f(_))) as Arbitrary.Arbitrary<
            {
              [K in keyof Props]: Props[K] extends S.SchemaAny
                ? S.ParsedShapeOf<Props[K]>
                : never
            }[number]
          >
      ),
      S.encoder((_): {
        [K in keyof Props]: Props[K] extends S.SchemaAny ? S.EncodedOf<Props[K]> : never
      }[number] => (encoders as any)[_[key]](_)),
      S.parser(
        (
          u: unknown
        ): Th.These<
          S.CompositionE<
            | S.PrevE<S.LeafE<S.TaggedUnionExtractKeyE>>
            | S.NextE<
                TaggedUnionE<
                  {
                    [K in keyof Props]: Props[K] extends S.SchemaAny
                      ? S.TaggedUnionMemberE<
                          S.ParsedShapeOf<Props[K]>[Key],
                          S.ParserErrorOf<Props[K]>
                        >
                      : never
                  }[number]
                >
              >
          >,
          {
            [K in keyof Props]: Props[K] extends S.SchemaAny
              ? S.ParsedShapeOf<Props[K]>
              : never
          }[number]
        > => {
          if (typeof u === "object" && u != null && key in u) {
            const tag = u[key as string]

            const memberParser = parsers[tag] as Parser.Parser<
              unknown,
              unknown,
              unknown
            >

            if (memberParser) {
              const result = memberParser(u)

              if (result.effect._tag === "Left") {
                return Th.fail(
                  S.compositionE(
                    Chunk.single(
                      S.nextE(
                        new S.TaggedUnionE({
                          errors: Chunk.single(
                            new S.TaggedUnionMemberE({
                              error: result.effect.left,
                              key: tag
                            }) as {
                              [K in keyof Props]: Props[K] extends S.SchemaAny
                                ? S.TaggedUnionMemberE<
                                    S.ParsedShapeOf<Props[K]>[Key],
                                    S.ParserErrorOf<Props[K]>
                                  >
                                : never
                            }[number]
                          )
                        })
                      )
                    )
                  )
                )
              } else {
                const warnings = result.effect.right.get(1)
                if (warnings._tag === "Some") {
                  return Th.warn(
                    result.effect.right.get(0) as any,
                    S.compositionE(
                      Chunk.single(
                        S.nextE(
                          new S.TaggedUnionE({
                            errors: Chunk.single(
                              new S.TaggedUnionMemberE({
                                error: warnings.value,
                                key: tag
                              }) as {
                                [K in keyof Props]: Props[K] extends S.SchemaAny
                                  ? S.TaggedUnionMemberE<
                                      S.ParsedShapeOf<Props[K]>[Key],
                                      S.ParserErrorOf<Props[K]>
                                    >
                                  : never
                              }[number]
                            )
                          })
                        )
                      )
                    )
                  )
                }

                return Th.succeed(result.effect.right.get(0) as any)
              }
            }
          }
          return Th.fail(
            S.compositionE(
              Chunk.single(
                S.prevE(
                  S.leafE(new S.TaggedUnionExtractKeyE({ field: key, actual: u, keys }))
                )
              )
            )
          )
        }
      ),
      S.constructor(
        (
          u: {
            [K in keyof Props]: Props[K] extends S.SchemaAny
              ? S.ConstructorInputOf<Props[K]>
              : never
          }[number]
        ): Th.These<
          TaggedUnionE<
            {
              [K in keyof Props]: Props[K] extends S.SchemaAny
                ? S.TaggedUnionMemberE<
                    S.ConstructedShapeOf<Props[K]>[Key],
                    S.ConstructorErrorOf<Props[K]>
                  >
                : never
            }[number]
          >,
          {
            [K in keyof Props]: Props[K] extends S.SchemaAny
              ? S.ConstructedShapeOf<Props[K]>
              : never
          }[number]
        > => {
          const tag = u[key as string]

          const memberParser = parsers[tag] as Parser.Parser<unknown, unknown, unknown>

          const result = memberParser(u)

          if (result.effect._tag === "Left") {
            return Th.fail(
              new S.TaggedUnionE({
                errors: Chunk.single(
                  new S.TaggedUnionMemberE({
                    error: result.effect.left,
                    key: tag
                  }) as {
                    [K in keyof Props]: Props[K] extends S.SchemaAny
                      ? S.TaggedUnionMemberE<
                          S.ConstructedShapeOf<Props[K]>[Key],
                          S.ConstructorErrorOf<Props[K]>
                        >
                      : never
                  }[number]
                )
              })
            )
          }

          const warnings = result.effect.right.get(1)

          if (warnings._tag === "Some") {
            return Th.warn(
              result.effect.right.get(0) as any,
              new S.TaggedUnionE({
                errors: Chunk.single(
                  new S.TaggedUnionMemberE({
                    error: warnings.value,
                    key: tag
                  }) as {
                    [K in keyof Props]: Props[K] extends S.SchemaAny
                      ? S.TaggedUnionMemberE<
                          S.ConstructedShapeOf<Props[K]>[Key],
                          S.ConstructorErrorOf<Props[K]>
                        >
                      : never
                  }[number]
                )
              })
            )
          }

          return Th.succeed(result.effect.right.get(0) as any)
        }
      ),
      S.mapApi(
        (_) =>
          ({
            matchS: (match) => (a) => match[a[key]](a),
            matchW: (match) => (a) => match[a[key]](a)
          } as TaggedApi<Key, Props>)
      )
    )
  }
}

export const tagged = makeTagged("_tag")
