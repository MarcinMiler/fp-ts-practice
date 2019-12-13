import * as O from 'fp-ts/lib/Option'
import * as P from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
import { monoidSum } from 'fp-ts/lib/Monoid'
import { semigroupSum } from 'fp-ts/lib/Semigroup'
import { eqNumber } from 'fp-ts/lib/Eq'
import { ordNumber } from 'fp-ts/lib/Ord'
import assert from 'assert'

// EXISTS

assert.strictEqual(
    P.pipe(
        O.some(1),
        O.exists(x => x > 0),
    ),
    true,
)

// FOLD

assert.strictEqual(
    P.pipe(
        O.some(1),
        O.fold(
            () => 0,
            x => x + 1,
        ),
    ),
    2,
)

assert.strictEqual(
    P.pipe(
        O.none,
        O.fold(
            () => 0,
            x => x + 1,
        ),
    ),
    0,
)

// FROM NULLABLE

assert.strictEqual(O.fromNullable(null), O.none)

// FROM PREDICATE

assert.deepStrictEqual(O.fromPredicate<number>(x => x > 0)(5), O.some(5))

assert.deepStrictEqual(O.fromPredicate<number>(x => x > 0)(0), O.none)

// getApplyMonoid

const M = O.getApplyMonoid(monoidSum)

assert.deepStrictEqual(M.concat(O.some(1), O.none), O.none)

assert.deepStrictEqual(M.concat(O.some(1), O.some(1)), O.some(2))

assert.deepStrictEqual(M.concat(O.some(1), M.empty), O.some(1))

// getApplySemigroup

const S1 = O.getApplySemigroup(semigroupSum)

assert.deepStrictEqual(S1.concat(O.none, O.none), O.none)
assert.deepStrictEqual(S1.concat(O.some(1), O.none), O.none)
assert.deepStrictEqual(S1.concat(O.none, O.some(1)), O.none)
assert.deepStrictEqual(S1.concat(O.some(1), O.some(2)), O.some(3))

// getEq

const E1 = O.getEq(eqNumber)

assert.deepStrictEqual(E1.equals(O.none, O.none), true)
assert.deepStrictEqual(E1.equals(O.some(1), O.none), false)
assert.deepStrictEqual(E1.equals(O.some(1), O.some(2)), false)
assert.deepStrictEqual(E1.equals(O.some(1), O.some(1)), true)

// getFirstMonoid && !getLastMonoid

const M1 = O.getFirstMonoid<number>()

assert.deepStrictEqual(M1.concat(O.some(1), O.none), O.some(1))

assert.deepStrictEqual(M1.concat(O.none, O.some(1)), O.some(1))

assert.deepStrictEqual(M1.concat(O.none, O.none), O.none)

// getLeft

assert.deepStrictEqual(O.getLeft(E.left('none')), O.some('none'))
assert.deepStrictEqual(O.getLeft(E.right('some')), O.none)

// getMonoid

const M2 = O.getMonoid(monoidSum)

assert.deepStrictEqual(M2.concat(O.none, O.none), O.none)
assert.deepStrictEqual(M2.concat(O.some(1), O.none), O.some(1))
assert.deepStrictEqual(M2.concat(O.none, O.some(2)), O.some(2))
assert.deepStrictEqual(M2.concat(O.some(1), O.some(1)), O.some(2))

// getOrElse

assert.strictEqual(
    P.pipe(
        O.some(1),
        O.getOrElse(() => 0),
    ),
    1,
)
assert.strictEqual(
    P.pipe(
        O.none,
        O.getOrElse(() => 0),
    ),
    0,
)

// getOrd

const O1 = O.getOrd(ordNumber)

assert.deepStrictEqual(O1.compare(O.none, O.none), 0)
assert.deepStrictEqual(O1.compare(O.some(1), O.none), 1)
assert.deepStrictEqual(O1.compare(O.none, O.some(1)), -1)
assert.deepStrictEqual(O1.compare(O.some(1), O.some(1)), 0)
assert.deepStrictEqual(O1.compare(O.some(2), O.some(1)), 1)

// getRefinement

type A = { type: 'A' }
type B = { type: 'B' }
type C = A | B

const isA = O.getRefinement<C, A>(c => (c.type === 'A' ? O.some(c) : O.none))

// getRight

assert.deepStrictEqual(O.getRight(E.left('none')), O.none)
assert.deepStrictEqual(O.getRight(E.right('some')), O.some('some'))

// isNone

assert.strictEqual(O.isNone(O.some(1)), false)
assert.strictEqual(O.isNone(O.none), true)

// isSome

assert.strictEqual(O.isSome(O.some(1)), true)
assert.strictEqual(O.isSome(O.none), false)

// mapNullable

interface User {
    a?: {
        b: string
    }
}

const user: User = {
    a: {
        b: 'some',
    },
}

assert.deepStrictEqual(
    P.pipe(
        O.fromNullable(user.a),
        O.mapNullable(a => a.b),
    ),
    O.some('some'),
)

// toNullable

assert.strictEqual(P.pipe(O.some(1), O.toNullable), 1)
assert.strictEqual(P.pipe(O.none, O.toNullable), null)

// toUndefined

assert.strictEqual(P.pipe(O.some(1), O.toUndefined), 1)
assert.strictEqual(P.pipe(O.none, O.toUndefined), undefined)

// tryCatch

assert.deepStrictEqual(
    O.tryCatch(() => {
        throw new Error()
    }),
    O.none,
)
assert.deepStrictEqual(
    O.tryCatch(() => 1),
    O.some(1),
)

// alt

assert.deepStrictEqual(
    O.alt(() => O.some('default'))(O.some('some')),
    O.some('some'),
)

assert.deepStrictEqual(
    O.alt(() => O.some('default'))(O.none),
    O.some('default'),
)

// ap

assert.deepStrictEqual(
    P.pipe(
        O.some((x: number) => x * 2),
        O.ap(O.some(10)),
    ),
    O.some(20),
)

assert.deepStrictEqual(
    P.pipe(
        O.some((x: number) => x * 2),
        O.ap(O.none),
    ),
    O.none,
)

assert.deepStrictEqual(P.pipe(O.none, O.ap(O.some(10))), O.none)

// apFirst

assert.deepStrictEqual(P.pipe(O.some(1), O.apFirst(O.some(2))), O.some(1))

assert.deepStrictEqual(P.pipe(O.none, O.apFirst(O.some(2))), O.none)

assert.deepStrictEqual(P.pipe(O.none, O.apFirst(O.none)), O.none)

assert.deepStrictEqual(P.pipe(O.some(1), O.apFirst(O.none)), O.none)

// apSecond

assert.deepStrictEqual(P.pipe(O.some(1), O.apSecond(O.some(2))), O.some(2))

assert.deepStrictEqual(P.pipe(O.none, O.apSecond(O.some(2))), O.none)

assert.deepStrictEqual(P.pipe(O.none, O.apSecond(O.none)), O.none)

assert.deepStrictEqual(P.pipe(O.some(1), O.apSecond(O.none)), O.none)

// chain

assert.deepStrictEqual(
    P.pipe(
        O.some(0),
        O.chain(x => (x === 0 ? O.none : O.some(x))),
    ),
    O.none,
)

assert.deepStrictEqual(
    P.pipe(
        O.some(2),
        O.chain(x => (x === 0 ? O.none : O.some(x))),
    ),
    O.some(2),
)

// chainFirst

assert.deepStrictEqual(
    P.pipe(
        O.some(0),
        O.chainFirst(x => (x === 0 ? O.none : O.some(x))),
    ),
    O.none,
)

assert.deepStrictEqual(
    P.pipe(
        O.some(2),
        O.chainFirst(x => (x === 0 ? O.none : O.some(x + 2))),
    ),
    O.some(2),
)

// compact

assert.deepStrictEqual(O.compact(O.some(O.some(1))), O.some(1))

// duplicate

assert.deepStrictEqual(O.duplicate(O.some(1)), O.some(O.some(1)))

// extend

const f = (x: O.Option<number>) =>
    O.isSome(x) ? (x.value % 2 === 0 ? 'even' : 'odd') : 'none'

assert.deepStrictEqual(P.pipe(O.some(1), O.extend(f)), O.some('odd'))
assert.deepStrictEqual(P.pipe(O.none, O.extend(f)), O.none)

// filter

assert.deepStrictEqual(
    P.pipe(
        O.some(1),
        O.filter(x => x > 0),
    ),
    O.some(1),
)

assert.deepStrictEqual(
    P.pipe(
        O.some(0),
        O.filter(x => x > 0),
    ),
    O.none,
)

// flatten

assert.deepStrictEqual(O.flatten(O.some(O.none)), O.none)
assert.deepStrictEqual(O.flatten(O.some(O.some(1))), O.some(1))
assert.deepStrictEqual(O.flatten(O.some(O.some(O.some(1)))), O.some(O.some(1)))

// foldMap

assert.deepStrictEqual(
    P.pipe(
        O.some(2),
        O.foldMap(monoidSum)(x => x + 2),
    ),
    4,
)

assert.deepStrictEqual(
    P.pipe(
        O.none,
        O.foldMap(monoidSum)(x => x + 2),
    ),
    0,
)

// fromEither

assert.deepStrictEqual(P.pipe(E.right(1), O.fromEither), O.some(1))
assert.deepStrictEqual(P.pipe(E.left(1), O.fromEither), O.none)

// map

assert.deepStrictEqual(
    P.pipe(
        O.some(2),
        O.map(x => x * 2),
    ),
    O.some(4),
)

assert.deepStrictEqual(
    P.pipe(
        O.none,
        O.map(x => x * 2),
    ),
    O.none,
)

// partition

assert.deepStrictEqual(
    P.pipe(
        O.some(1),
        O.partition(x => x > 0),
    ),
    { left: O.none, right: O.some(1) },
)

assert.deepStrictEqual(
    P.pipe(
        O.some(0),
        O.partition(x => x > 0),
    ),
    { left: O.some(0), right: O.none },
)

// partition map

assert.deepStrictEqual(
    P.pipe(
        O.some(1),
        O.partitionMap(x => (x > 0 ? E.right(x) : E.left('0'))),
    ),
    { left: O.none, right: O.some(1) },
)

assert.deepStrictEqual(
    P.pipe(
        O.some(0),
        O.partitionMap(x => (x > 0 ? E.right(x) : E.left('0'))),
    ),
    { left: O.some('0'), right: O.none },
)

// reduce

assert.deepStrictEqual(
    P.pipe(
        O.some(1),
        O.reduce(0, (x, y) => x + y),
    ),
    1,
)
