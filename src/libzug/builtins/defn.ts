import { LErr, LFun, LObject, LString, LSym, LVal, LVec, NIL } from "../lval";

export function let_(env: LObject, args: Array<LVal>): LVal {
  if (args.length != 2) {
    return new LErr(
      `TypeError: let takes 2 arguments, received ${args.length}`
    );
  }

  let arg = args[0];
  let sym: string;
  if (arg instanceof LSym) {
    sym = arg.s;
  } else if (arg instanceof LString) {
    sym = arg.s;
  } else {
    return new LErr(`TypeError: let takes SYM/STRING not ${arg.type}`);
  }

  env.set(sym, args[1]);
  return NIL;
}

export function lambda(env: LObject, args: Array<LVal>, isDef?: boolean): LVal {
  if (!(args.length === 2)) {
    return new LErr(
      `TypeError: lambda requires two arguments, not ${args.length}`
    );
  }
  const iFormals = args[0];
  const body = args[1];
  if (!(iFormals instanceof LVec && body instanceof LVec)) {
    return new LErr("TypeError: lambda requires VEC as its arguments");
  }

  let formals: LVec = isDef ? new LVec(iFormals.cell.slice(1)) : iFormals;

  let varargs = false;
  for (let i = 0; i < formals.cell.length; i++) {
    const arg = formals.cell[i];
    if (!(arg instanceof LSym)) {
      if ((arg === NIL) && (i === formals.cell.length - 2)) {
        // e.g. foo ,x y .. zs,
        varargs = true;
      } else {
        return new LErr(
          `TypeError: lambda requires SYM as arguents, not ${arg.type}`
        );
      }

    }
  }

  const f = new LFun(env, formals, body);
  if (isDef) {
    let name = iFormals.cell[0];
    if (name === undefined) {
      return new LErr("TypeError: def requires a name");
    }
    if (!(name instanceof LSym)) {
      return new LErr(`TypeError: def requires SYM not ${name.type}`);
    }
    env.set(name.s, f);
    return NIL;
  }

  return f;
}

export function doc(env: LObject, args: Array<LVal>): LVal {
  if (args.length === 1) {
    return new LString(args[0].docs);
  }

  if (args.length === 2) {
    const comment = args[1];
    if (!(comment instanceof LString)) {
      return new LErr(`TypeError: docs expected STRING, got ${comment.type}`);
    }
    if (args[0] !== NIL) {
      // NIL implies comment rather than docstring
      args[0].docs = comment.s;
    }
    return NIL;
  }

  return new LErr("TypeError: docs takes 1 or 2 parameters");
}
