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
