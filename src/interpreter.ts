import { LObject, LVal } from "./lval";
import seedEnv from "./builtins";

export default class Interpreter {
  env: LObject;

  constructor(env?: LObject) {
    this.env = env ? env : seedEnv();
  }

  interpret(tree: LVal): LVal {
    return tree.eval(this.env);
  }
}
