import {
  FALSE,
  LVec,
  LBool,
  LErr,
  LNum,
  LObject,
  LString,
  LVal,
  NIL,
  SExpr,
  TRUE,
} from "../lval";

export function if_(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 2 && args.length !== 3) {
    return new LErr(`TypeError: if takes 2 or 3 arguments, not ${args.length}`);
  }

  const cond = args[0];
  const first = args[1];

  if (!(cond instanceof LBool)) {
    return new LErr(`TypeError: if takes BOOL, not ${first.type}`);
  }

  if (!(first instanceof LVec)) {
    return new LErr(`TypeError: if takes VEC, not ${first.type}`);
  }

  if (cond.bool) {
    return new SExpr(first.cell).eval(env);
  }

  if (args.length === 2) {
    return NIL;
  }

  const second = args[2];
  if (!(second instanceof LVec)) {
    return new LErr(`TypeError: if takes VEC, not ${second.type}`);
  }

  return new SExpr(second.cell).eval(env);
}

export function eq(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 2) {
    return new LErr(
      `TypeError: comparison takes 2 arguments, got ${args.length}`
    );
  }

  return args[0].equals(args[1]) ? TRUE : FALSE;
}

export function gt(env: LObject, args: Array<LVal>): LVal {
  return genericCompare(args, (a: any, b: any) => a > b);
}

export function lt(env: LObject, args: Array<LVal>): LVal {
  return genericCompare(args, (a: any, b: any) => a < b);
}

export function ge(env: LObject, args: Array<LVal>): LVal {
  return genericCompare(args, (a: any, b: any) => a >= b);
}

export function le(env: LObject, args: Array<LVal>): LVal {
  return genericCompare(args, (a: any, b: any) => a <= b);
}

function genericCompare(args: Array<LVal>, comparator: CallableFunction): LVal {
  if (args.length !== 2) {
    return new LErr(
      `TypeError: comparison takes 2 arguments, got ${args.length}`
    );
  }

  const first = args[0];
  const second = args[1];

  if (first instanceof LNum && second instanceof LNum) {
    return comparator(first.num, second.num) ? TRUE : FALSE;
  }
  if (first instanceof LString && second instanceof LString) {
    return comparator(first.s, second.s) ? TRUE : FALSE;
  }

  return new LErr(
    `TypeError: don't know how to compare ${first.type} and ${second.type}`
  );
}
