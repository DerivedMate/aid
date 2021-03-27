export type Key = number | string | symbol
export const transposeDict = <A extends Key, B extends Key>(dict: Record<A, B>): Record<B, A> =>
  Object.fromEntries(Object.entries(dict).map(([a, b]) => [b, a] as [B, A])) as Record<B, A>

export const findRV = <A extends Key, B extends Key>(map: Record<A, B>, nullDef: B, k: Key): B => {
  if (k in map) return map[k as A]

  return nullDef
}
