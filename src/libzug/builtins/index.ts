import { add, sub, mul, div } from "./arithmetic";
import { if_, eq, le, ge, lt, gt } from "./conditionals";
import { def, doc, lambda, let_, set } from "./defn";
import { import_ } from "./imports";
import { Builtin, LCallable, LObject } from "../lval";
import { getattr, keys, object, values } from "./object";
import { env as getenv, exit, print } from "./sys";
import { list, head, tail, join, evaluate } from "./array";

export default function seedEnv(env?: LObject): LObject {
  env = env ? env : new LObject([], []);
  // lists
  newBuiltin(
    env,
    "array",
    list,
    "array [..xs]\n" +
      "Create a new array from the following expression without evaluating it.\n" +
      "Example:\n  > array .add 1 2.\n  [.add 1 2.]"
  );
  newBuiltin(
    env,
    "list",
    list,
    "list [..xs]\n" + "Create a new array from the provided arguments.\n" +
    "Example:\n  > list .add 1 2.\n  [3]"
  );
  newBuiltin(
    env,
    "head",
    head,
    "head [array]\n" + "Get the first entry in an array."
  );
  newBuiltin(
    env,
    "tail",
    tail,
    "tail [array]\n" + "Create a new array without the first element."
  );
  newBuiltin(
    env,
    "join",
    join,
    "join [..arrays]\n" + "Concatenate the provided arrays."
  );
  newBuiltin(
    env,
    "eval",
    evaluate,
    "eval [array]\n" + "Evaluate the array as a standard expression."
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
  // comparison
  newBuiltin(
    env,
    "if",
    if_,
    "if [bool array array?]\n" +
      "Evaluate and return the first array if bool is true, else the second."
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
    "set",
    set,
    "set [array array]\n" +
      "Assign the elements of the second array symbols of the first."
  );
  newBuiltin(
    env,
    "lambda",
    lambda,
    "lambda [array array]\n" +
      "Create a new function with args and body arrays."
  );
  newBuiltin(
    env,
    "def",
    def,
    "def [array array]\n" +
      "Create a new function (see doc lambda), where the head of the first name is treated as the name, and the tail as the args."
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
    "object [array array]\n" +
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
