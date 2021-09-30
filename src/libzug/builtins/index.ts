import { add, sub, mul, div, sqrt } from "./arithmetic";
import { if_, eq, le, ge, lt, gt } from "./conditionals";
import { doc, lambda, let_ } from "./defn";
import { import_ } from "./imports";
import { Builtin, LCallable, LObject } from "../lval";
import { getattr, keys, object, values } from "./object";
import { env as getenv, exit, print } from "./sys";
import { list, head, tail, join, evaluate } from "./vec";

export default function seedEnv(env?: LObject): LObject {
  env = env ? env : new LObject([], []);
  // lists
  newBuiltin(
    env,
    "vec",
    list,
    "vec [..xs]\n" +
      "Create a new vec from the following expression without evaluating it.\n" +
      "Example:\n  > vec .add 1 2.\n  [.add 1 2.]"
  );
  newBuiltin(
    env,
    "list",
    list,
    "list [..xs]\n" + "Create a new vec from the provided arguments.\n" +
    "Example:\n  > list .add 1 2.\n  [3]"
  );
  newBuiltin(
    env,
    "head",
    head,
    "head [vec]\n" + "Get the first entry in an vec."
  );
  newBuiltin(
    env,
    "tail",
    tail,
    "tail [vec]\n" + "Create a new vec without the first element."
  );
  newBuiltin(
    env,
    "join",
    join,
    "join [..vecs]\n" + "Concatenate the provided vecs."
  );
  newBuiltin(
    env,
    "eval",
    evaluate,
    "eval [vec]\n" + "Evaluate the vec as a standard expression."
  );
  // zip .. unzip ..
  // arithmetic
  newBuiltin(env, "add", add, "add [..xs]\n" + "Add a collection of numbers.");
  newBuiltin(
    env,
    "sub",
    sub,
    "sub [..xs]\n" +
      "Subtract all subsequent numbers from the first provided number."
  );
  newBuiltin(
    env,
    "mul",
    mul,
    "mul [..xs]\n" + "Multiply a collection of numbers"
  );
  newBuiltin(
    env,
    "div",
    div,
    "div [..xs]\n" +
      "Divide the first provided number by all subsequent numbers."
  );
  newBuiltin(
    env,
    "sqrt",
    sqrt,
    "sqrt [x]\n" +
      "Take the square root of the number."
  );
  // comparison
  newBuiltin(
    env,
    "if",
    if_,
    "if [bool vec vec?]\n" +
      "Evaluate and return the first vec if bool is true, else the second."
  );
  newBuiltin(
    env,
    "eq",
    eq,
    "eq [x y]\n" + "Returns true if x==y, else returns false."
  );
  newBuiltin(
    env,
    "lt",
    lt,
    "lt [x y]\n" + "Returns true if x<y, else returns false."
  );
  newBuiltin(
    env,
    "gt",
    gt,
    "gt [x y]\n" + "Returns true if x>y, else returns false."
  );
  newBuiltin(
    env,
    "le",
    le,
    "le [x y]\n" + "Returns true if x<=y, else returns false."
  );
  newBuiltin(
    env,
    "ge",
    ge,
    "ge [x y]\n" + "Returns true if x>=y, else returns false."
  );
  // definitions
  newBuiltin(
    env,
    "let",
    let_,
    "let sym expr\n" + "Assign the evaluated expression to the symbol sym."
  );
  newBuiltin(
    env,
    "lambda",
    lambda,
    "lambda [vec vec]\n" +
      "Create a new function with args and body vecs."
  );
  newBuiltin(
    env,
    "doc",
    doc,
    "doc [sym string?]\n" +
      "Print the docs for the given symbol, or set them if a string is provided."
  );
  // process
  newBuiltin(
    env,
    "env",
    getenv,
    "env\n" + "Return the current environment (i.e. all defined variables)."
  );
  newBuiltin(
    env,
    "exit",
    exit,
    "exit [code?]\n" +
      "Exit the current program returning the given code (default 0)."
  );
  newBuiltin(
    env,
    "print",
    print,
    "print [..strings]\n" + "Print the strings to stdout."
  );
  // newBuiltin(
  //   env,
  //   "input",
  //   input,
  //   "input [string?]\n" + "Receive input from stdin, possibly with a prompt string."
  // );
  newBuiltin(
    env,
    "import",
    import_,
    "import [string]\n" +
      "Import a module. Example: import ,...foo.bar, will import ../../foo/bar.zug."
  );
  // objects
  newBuiltin(
    env,
    "object",
    object,
    "object [vec vec]\n" +
      "Create a new object and set its attributes. See doc set."
  );
  newBuiltin(
    env,
    "getattr",
    getattr,
    "getattr [object string (default)]\n" + "Get the given attribute on the object."
  );
  newBuiltin(
    env,
    "keys",
    keys,
    "keys [object]: return the keys of the object."
  );
  newBuiltin(
    env,
    "values",
    values,
    "values [object]: return the values of the object."
  );
  // env.set("setattr", new Builtin("getattr", getattr));
  // super

  return env;
}

function newBuiltin(env: LObject, name: string, func: LCallable, docs: string) {
  const builtin = new Builtin(name, func);
  builtin.docs = docs;
  env.set(name, builtin);
}
