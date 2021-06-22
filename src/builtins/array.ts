import { LErr, LObject, LVal, LArray, SExpr } from "../lval";

export function list(env: LObject, args: Array<LVal>): LVal {
  return new LArray(args);
}

export function head(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 1) {
    return new LErr("TypeError: head takes 1 argument");
  }

  let q = args[0];
  if (!(q instanceof LArray)) {
    return new LErr(`TypeError: head takes an Array, not ${q.type}`);
  }

  if (q.cell.length === 0) {
    return new LErr("ValueError: head passed []");
  }

  return new LArray([q.cell[0]]);
}

export function tail(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 1) {
    return new LErr("TypeError: tail takes 1 argument");
  }

  let q = args[0];
  if (!(q instanceof LArray)) {
    return new LErr(`TypeError: tail takes an Array, not ${q.type}`);
  }

  if (q.cell.length === 0) {
    return new LErr("ValueError: tail passed , ,");
  }

  return new LArray(q.cell.slice(1));
}

export function join(env: LObject, args: Array<LVal>): LVal {
  let children: Array<LVal> = [];
  for (let arg of args) {
    if (!(arg instanceof LArray)) {
      return new LErr(`TypeError: join takes ARRAY, not ${arg.type}`);
    }
    children.push(...arg.cell);
  }

  return new LArray(children);
}

export function evaluate(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 1) {
    return new LErr("TypeError: eval takes 1 argument");
  }

  let q = args[0];
  if (!(q instanceof LArray)) {
    return new LErr(`TypeError: eval takes an Array, not ${q.type}`);
  }

  if (q.cell.length === 0) {
    return new LErr("ValueError: eval passed , ,");
  }

  return new SExpr(q.cell).eval(env);
}
