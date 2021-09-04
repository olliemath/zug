import { request } from "https";
import { evaluate } from "./builtins/array";

export interface LVal {
  type: string;
  docs: string;

  print(): string;
  equals(other: LVal): boolean;
  eval(env: LObject): LVal;
}

export interface LCallable {
  (env: LObject, args: Array<LVal>): LVal;
}

export class LNil implements LVal {
  /* LNil represents the zug null type */
  type = "NIL";
  docs = "The Zug nil value (..).";

  print() {
    return "nil";
  }
  equals(other: LVal): boolean {
    return other instanceof LNil;
  }
  eval(env: LObject): LVal {
    return this;
  }
}

export class LNum implements LVal {
  /* LNum represents a zug number. */
  num: number;
  docs: string;
  type = "NUMBER";

  constructor(num: number) {
    this.num = num;
    this.docs = "A zug number. Similar to javascript's number type.";
  }
  print() {
    return this.num.toString();
  }
  equals(other: LVal): boolean {
    return other instanceof LNum && other.num === this.num;
  }
  eval() {
    return this;
  }
}

export class LBool implements LVal {
  /* LNil represents the zug booleans */
  type = "BOOLEAN";
  docs = "A zug boolean value.";
  bool: boolean;

  constructor(bool: boolean) {
    this.bool = bool;
  }
  print() {
    return this.bool ? 'true' : 'false';
  }
  equals(other: LVal): boolean {
    return other instanceof LBool && other.bool === this.bool;
  }
  eval(env: LObject): LVal {
    return this;
  }
}

export class LString implements LVal {
  /* LNum represents a zug number. */
  type = "STRING";
  s: string;
  docs = "A utf-8 encoded Zug string.";

  constructor(s: string) {
    this.s = s;
  }
  print() {
    return this.s;
  }
  equals(other: LVal): boolean {
    return other instanceof LString && this.s === other.s;
  }
  eval(env: LObject): LVal {
    return this;
  }
}
export class LErr extends LString {
  /* LErr represents a zug error. */
  type = "ERROR";
  docs = "A Zug error.";

  equals(other: LVal): boolean {
    return other instanceof LErr && this.s === other.s;
  }
}

export class LSym extends LString {
  /* LSym represents a zug symbol. */
  type = "SYM";
  docs = "A Zug symbol.";

  equals(other: LVal): boolean {
    return other instanceof LString && this.s === other.s;
  }
  eval(env: LObject): LVal {
    return env.get(this.s);
  }
}

export class SExpr implements LVal {
  /* LNum represents a zug (symbolic) expression. */
  type = "SEXPR";
  cell: Array<LVal>;
  docs = "A Zug expression.";

  constructor(children?: Array<LVal>) {
    this.cell = children ? children : [];
  }
  print() {
    let body = this.cell.map((c) => c.print()).join(" ");
    return "." + body + ".";
  }
  equals(other: LVal): boolean {
    if (!(other instanceof SExpr && other.cell.length === this.cell.length)) {
      return false;
    }
    for (let i = 0; i < this.cell.length; i++) {
      if (!this.cell[i].equals(other.cell[i])) {
        return false;
      }
    }
    return true;
  }
  eval(env: LObject): LVal {
    if (this.cell.length == 0) {
      return this;
    }

    const first = this.cell[0].eval(env);
    if (
      this.cell.length == 1 &&
      !(first instanceof Builtin || first instanceof LFun)
    ) {
      return first.eval(env);
    }

    // Ensure First Element is function
    if (first instanceof Builtin || first instanceof LFun) {
      let args: Array<LVal>;
      if (first.name === "array") {
        // The array literal is the *only* function not to have its arguments evaluated
        args = this.cell.slice(1);
      } else if (first.name === "let") {
        args = [this.cell[1]];
        for (let child of this.cell.slice(2)) {
          let evaluated = child.eval(env);
          if (evaluated instanceof LErr) {
            return evaluated;
          }
          args.push(evaluated);
        }
      } else {
        args = [];
        for (let child of this.cell.slice(1)) {
          let evaluated = child.eval(env);
          if (evaluated instanceof LErr) {
            return evaluated;
          }
          args.push(evaluated);
        }
      }

      return first.fun(env, args);
    }

    return new LErr("SyntaxError: Expression does not start with a callable");
  }
}

export class LArray implements LVal {
  /* LArray represents a zug array ("quoted expression"). */
  type = "ARRAY";
  cell: Array<LVal>;
  docs = "A Zug array.";

  constructor(children?: Array<LVal>) {
    this.cell = children ? children : [];
  }
  print(): string {
    let body = this.cell.map((c) => c.print()).join(" ");
    return "[" + body + "]";
  }
  equals(other: LVal): boolean {
    if (!(other instanceof LArray && other.cell.length === this.cell.length)) {
      return false;
    }
    for (let i = 0; i < this.cell.length; i++) {
      if (!this.cell[i].equals(other.cell[i])) {
        return false;
      }
    }
    return true;
  }
  eval(): LVal {
    return this;
  }
}

export class Builtin implements LVal {
  type = "FUN";
  docs = "A Zug builtin";
  name: string;
  fun: LCallable;

  constructor(name: string, fun: LCallable) {
    this.name = name;
    this.fun = fun;
  }
  print(): string {
    return `<function ${this.name}>`;
  }
  equals(other: LVal): boolean {
    return other instanceof Builtin && other.fun === this.fun;
  }
  eval(env: LObject): LVal {
    return this;
  }
}

export class LFun implements LVal {
  type = "FUN";
  name: string | null;
  env: LObject;
  formals: LArray;
  body: LArray;
  docs: string;

  constructor(env: LObject, formals: LArray, body: LArray, name?: string) {
    this.name = name ? name : null;
    this.env = env;
    this.formals = formals;
    this.body = body;
    this.docs = "";
  }
  print(): string {
    if (this.name === null) {
      return `<function lambda ${this.formals.print()}>`;
    }
    return `<function ${this.name}>`;
  }
  equals(other: LVal): boolean {
    return (
      other instanceof LFun &&
      other.formals.equals(this.formals) &&
      other.body.equals(this.body)
    );
  }
  eval(env: LObject): LVal {
    return this;
  }
  fun(env: LObject, args: Array<LVal>): LVal {
    const total = this.formals.cell.length;
    let bound = 0;

    env = new LObject([], [], this.env);

    for (let i = 0; i < args.length; i++) {
      // If we've run out of formal arguments to bind
      if (bound >= total) {
        return new LErr(
          `TypeError: function passed ${args.length} arguments but expected ${total}`
        );
      }

      if (this.formals.cell[bound] !== NIL) {
        // @ts-ignore  symbol type-checked when constructing LFun
        env.set(this.formals.cell[bound].s, args[i]);
        bound += 1;
      } else {
        // The remaining args are for a variable arg function
        // @ts-ignore  symbol type-checked when constructing LFun
        env.set(this.formals.cell[bound + 1].s, new LArray(args.slice(i)));
        bound = total;
        break;
      }
    }

    if (bound === total) {
      return evaluate(env, [this.body]);
    }

    // New partial function - create a new Array for remaining args
    const unbound = new LArray(this.formals.cell.slice(bound));
    return new LFun(env, unbound, this.body);
  }
}

export class LObject implements LVal {
  type = "OBJECT";
  docs = "A Zug object.";
  map: Map<string, LVal>;
  parent: LObject | null;
  constructor(keys: Array<string>, values: Array<LVal>, parent?: LObject) {
    this.map = new Map<string, LVal>();
    this.parent = parent ? parent : null;

    for (let i = 0; i < keys.length; i++) {
      this.map.set(keys[i], values[i]);
    }
  }
  print() {
    let body = [];
    for (let [key, val] of this.map.entries()) {
      body.push(key + ":" + val.print());
    }
    return "," + body.join(" ") + ",";
  }
  equals(other: LVal) {
    if (!(other instanceof LObject)) {
      return false;
    }
    if (other.map.size !== this.map.size) {
      return false;
    }
    for (let [key, val] of this.map.entries()) {
      if (!(other.map.has(key))) {
        return false;
      }
      if (!(other.get(key).equals(val))) {
        return false;
      }
    }
    return true;
  }
  eval() {
    return this;
  }
  keys(): Array<string> {
    let result = [];
    for (let key of this.map.keys()) {
      result.push(key);
    }
    return result;
  }
  values(): Array<LVal> {
    let result = [];
    for (let val of this.map.values()) {
      result.push(val);
    }
    return result;
  }
  set(key: string, value: LVal) {
    this.map.set(key, value);
  }
  get(key: string): LVal {
    const result = this.map.get(key);
    if (result === undefined) {
      if (this.parent === null) {
        return new LErr(`AttributeError: ${key} is undefined`);
      }
      return this.parent.get(key);
    }
    return result;
  }
}

export const NIL = new LNil();
export const TRUE = new LBool(true);
export const FALSE = new LBool(false);

export function lvalRead(token: any): LVal {
  // Read raw tree nodes to LVal instances
  switch (token.type) {
    case "NUMBER":
      return new LNum(token.value);
    case "STRING":
      return new LString(token.value);
    case "SYM":
      return new LSym(token.value);
    case "NIL":
      return NIL;
    case "TRUE":
      return TRUE;
    case "FALSE":
      return FALSE;
    case "SEXPR":
      return new SExpr(token.value.map((c: any) => lvalRead(c)));
    case "ARRAY":
      return new LArray(token.value.map((c: any) => lvalRead(c)));
    default:
      throw new Error(`ZugInternalError: unknown type: ${token.type}`);
  }
}
