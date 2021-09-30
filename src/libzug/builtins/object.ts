import { LErr, LNum, LObject, LString, LSym, LVal, LVec, NIL } from "../lval";

export function object(env: LObject, args: Array<LVal>): LVal {
  // The candidate object
  const obj = new LObject([], []);
  const result = set(obj, args);
  if (result instanceof LErr) {
    return result;
  }
  return obj;
}

function set(env: LObject, args: Array<LVal>): LVal {
  // Set the symbols to values in the object
  if (args.length !== 2) {
    return new LErr(`TypeError: object takes 2 arguments, not ${args.length}`);
  }

  const syms = args[0];
  const vals = args[1];
  if (!(syms instanceof LVec && vals instanceof LVec)) {
    return new LErr(
      `TypeError: object takes VEC, VEC not ${syms.type}, ${vals.type}`
    );
  }

  for (let sym of syms.cell) {
    if (!(sym instanceof LSym || sym instanceof LString)) {
      return new LErr(`TypeError: object assings to SYM/STRING not ${sym.type}`);
    }
  }

  if (syms.cell.length != vals.cell.length) {
    return new LErr(
      `TypeError: object requires same number of symbols and values`
    );
  }

  for (let i = 0; i < syms.cell.length; i++) {
    const sym = syms.cell[i];
    if (sym instanceof LSym) {
      env.set(sym.s, vals.cell[i]);
    } else if (sym instanceof LString) {
      env.set(sym.s, vals.cell[i]);
    } else {
      throw new Error(`InternalError: unhandled assignment ${sym}`);
    }
  }

  return NIL;
}

export function getattr(env: LObject, args: Array<LVal>): LVal {
  if (args.length < 2 || args.length > 3) {
    return new LErr(
      `TypeError: getattr takes 2 or 3 arguments, but got ${args.length}`
    )
  }
  let obj: LVal = args[0];
  let attr: LVal = args[1];

  if (!(obj instanceof LObject)) {
    if (obj instanceof LVec) {
      // e.g. `getattr (1 2 3) 1` gives 2
      if (!(attr instanceof LNum)) {
        return new LErr(
          `TypeError: getattr requires INTEGER but got ${attr.type}`
        )
      }
      if (attr.num >= obj.cell.length) {
        return new LErr(`AttributeError: ${attr.num}`)
      }
      return obj.cell[attr.num];
    }


    return new LErr(
      `TypeError: getattr requires OBJECT, but got ${obj.type}`
    )
  }
  if (!(attr instanceof LString)) {
    return new LErr(
      `TypeError: getattr requires STRING, but got ${attr.type}`
    )
  }
  const candidate = obj.get(attr.s);
  if ((candidate instanceof LErr) && (args.length === 3)) {
    return args[2];
  }
  return candidate;
}

export function keys(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 1) {
    return new LErr("TypeError: keys takes 1 argument");
  }
  let arg = args[0]
  if (!(arg instanceof LObject)) {
    return new LErr(`TypeError: keys requires OBJECT not ${arg.type}`)
  }
  return new LVec(arg.keys().map((k) => new LString(k)));
}

export function values(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 1) {
    return new LErr("TypeError: values takes 1 argument");
  }
  let arg = args[0]
  if (!(arg instanceof LObject)) {
    return new LErr(`TypeError: values requires OBJECT not ${arg.type}`)
  }
  return new LVec(arg.values());
}
