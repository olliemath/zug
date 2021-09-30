import test from "ava";

import { head, tail, join } from "../../libzug/builtins/vec";
import seedEnv from "../../libzug/builtins"
import { LNum, LVec } from "../../libzug/lval";

const someLVec = () => { return new LVec([new LNum(42)])};
const tooMany = () => { return [someLVec(), someLVec()] };
const tooFew = () => { return [] };
const nil = () => { return [new LVec()]};
const wrongType = () => { return [new LNum(42)]};
const wrongType2 = () => { return [someLVec(), new LNum(42)]};


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
    t.deepEqual(join(seedEnv(), []), new LVec());
})
