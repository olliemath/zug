import test from "ava";

import { head, tail, join } from "../../builtins/array";
import seedEnv from "../../builtins"
import { LNum, LArray } from "../../lval";

const someLArray = () => { return new LArray([new LNum(42)])};
const tooMany = () => { return [someLArray(), someLArray()] };
const tooFew = () => { return [] };
const nil = () => { return [new LArray()]};
const wrongType = () => { return [new LNum(42)]};
const wrongType2 = () => { return [someLArray(), new LNum(42)]};


test("head raises TypeError with bad args", (t) => {
    t.is(head(seedEnv(), tooMany()).type, "ERROR");
    t.is(head(seedEnv(), tooFew()).type, "ERROR");
    t.is(head(seedEnv(), nil()).type, "ERROR");
    t.is(head(seedEnv(), wrongType()).type, "ERROR");
    t.is(head(seedEnv(), tooMany()).type, "ERROR");
})

test("tali raises TypeError with bad args", (t) => {
    t.is(tail(seedEnv(), tooMany()).type, "ERROR");
    t.is(tail(seedEnv(), tooFew()).type, "ERROR");
    t.is(tail(seedEnv(), nil()).type, "ERROR");
    t.is(tail(seedEnv(), wrongType()).type, "ERROR");
    t.is(tail(seedEnv(), tooMany()).type, "ERROR");
})

test("join raises TypeError with bad args", (t) => {
    t.is(join(seedEnv(), wrongType2()).type, "ERROR")
})

test("join no args", (t) => {
    t.deepEqual(join(seedEnv(), []), new LArray());
})
