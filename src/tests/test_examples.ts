import test from "ava";
import Interpreter from "../interpreter";
import { lvalRead } from "../lval";
// @ts-ignore
import parser from "../grammar/zug.js";

const testExamples = (msg: string, cases: Array<Array<string>>) => {
  const total = cases.length;
  const interpreter = new Interpreter();

  for (let i = 0; i < cases.length; i++) {
    let ith_msg = `${msg} ${i + 1}/${total}`;
    let input = cases[i][0];
    let expected = cases[i][1];
    test(ith_msg, (t) => {
      let tree = parser.parse(input);
      let result = interpreter.interpret(lvalRead(tree));
      t.is(result.print(), expected);
    });
  }
};

const testPartialExamples = (msg: string, cases: Array<Array<string>>) => {
  const total = cases.length;
  const interpreter = new Interpreter();

  for (let i = 0; i < cases.length; i++) {
    let ith_msg = `${msg} ${i + 1}/${total}`;
    let input = cases[i][0];
    let expected = cases[i][1];
    test(ith_msg, (t) => {
      let tree = parser.parse(input);
      let result = interpreter.interpret(lvalRead(tree));
      t.is(result.print().indexOf(expected), 0);
    });
  }
};

testExamples("test addition", [
  ["add", "0"],
  ["add 1", "1"],
  ["add 1 2", "3"],
  ["add 1 2 3", "6"],
]);

testExamples("test arithmetic inverses", [
  ["sub .add 5 7. 7", "5"],
  ["div .mul 5 7. 7", "5"],
]);

testExamples("test qexpressions", [
  ["list 1 2 3 4", "[1 2 3 4]"],
  [".array head .list 1 2 3 4..", "[head .list 1 2 3 4.]"],
  ["eval .array head .list 1 2 3 4..", "[1]"],
  ["tail .array tail tail tail.", "[tail tail]"],
  ["eval .tail .array tail tail .array 5 6 7...", "[6 7]"],
  ["eval .head .array .add 1 2. .add 10 20...", "3"],
]);

testExamples("test variables", [
  ["set [a b] [1 2]", "nil"],
  ["a", "1"],
  ["b", "2"],
  ["let a 42", "nil"],
  ["a", "42"],
]);

testPartialExamples("test variable errors", [
  ["set [a b] 1", "TypeError"],
  ["let [a] 1", "TypeError"],
  ["set add sub 1 2", "TypeError"],
  ["set .add. 1", "TypeError"],
]);

testExamples("test lambdas", [
  ["let foo .lambda [a b] [sub .add a b. 1].", "nil"],
  ["foo 5 5", "9"],
  ["foo 5 6", "10"],
  // These test that setting variables in our function has no effect
  ["let var 42", "nil"],
  ["let setter .lambda [a] [let var a].", "nil"],
  ["setter 32", "nil"],
  ["var", "42"],
]);

testExamples("test conditionals", [
  // With numbers
  ["ge 1 2", "false"],
  ["ge 2 1", "true"],
  ["ge 1 1", "true"],
  ["lt 1 2", "true"],
  ["lt 2 1", "false"],
  ["lt 1 1", "false"],
  // With strings
  ["ge ,1, ,2,", "false"],
  ["ge ,2, ,1,", "true"],
  ["ge ,1, ,1,", "true"],
  ["lt ,1, ,2,", "true"],
  ["lt ,2, ,1,", "false"],
  ["lt ,1, ,1,", "false"],
  // Using if
  ["if .le 1 2. [1] [2]", "1"],
  ["if .ge 1 2. [1] [2]", "2"],
]);

testPartialExamples("test conditional errors", [
  ["ge 1 ,2,", "TypeError"],
  ["ge ,1, 2", "TypeError"],
  ["ge 1 ..", "TypeError"],
  ["ge .. ..", "TypeError"],
  ["ge 1", "TypeError"],
  ["ge 1 2 3", "TypeError"],
  ["ge [1 2] [2 3]", "TypeError"],
]);
