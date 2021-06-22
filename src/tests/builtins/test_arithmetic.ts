import test from "ava";

import { add, sub, mul, div } from "../../builtins/arithmetic";
import seedEnv from "../../builtins"
import { LNum, LSym } from "../../lval";

test("arithmetic with no args is default value", (t) => {
  t.deepEqual(add(seedEnv(), []), new LNum(0));
  t.deepEqual(sub(seedEnv(), []), new LNum(0));
  t.deepEqual(mul(seedEnv(), []), new LNum(1));
  t.deepEqual(div(seedEnv(), []), new LNum(1));
});

const lval_fixture = () => {
    return [new LNum(1), new LNum(2), new LNum(3), new LNum(4)];
}

test("add works", (t) => {
    t.deepEqual(add(seedEnv(), lval_fixture()), new LNum(1 + 2 + 3 + 4));
});
test("sub works", (t) => {
    t.deepEqual(sub(seedEnv(), lval_fixture()), new LNum(1 - 2 - 3 - 4));
});
test("mul works", (t) => {
    t.deepEqual(mul(seedEnv(), lval_fixture()), new LNum(1 * 2 * 3 * 4));
});
test("div works", (t) => {
    t.deepEqual(div(seedEnv(), lval_fixture()), new LNum(1 / 2 / 3 / 4));
});

const bad_lval_fixture = () => {
    return [new LNum(1), new LSym("add")];
}

test("bad lvals raise TypeError", (t) => {
    t.is(add(seedEnv(), bad_lval_fixture()).type, "ERROR");
    t.is(sub(seedEnv(), bad_lval_fixture()).type, "ERROR");
    t.is(mul(seedEnv(), bad_lval_fixture()).type, "ERROR");
    t.is(div(seedEnv(), bad_lval_fixture()).type, "ERROR");
})
