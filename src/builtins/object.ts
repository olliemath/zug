import { LErr, LObject, LString, LSym, LVal, LArray } from "../lval";
import { set } from "./defn";
import { typecheck } from "./typecheck";

export function object(env: LObject, args: Array<LVal>): LVal {
  // The candidate object
  const obj = new LObject([], []);
  const result = set(obj, args);
  if (result instanceof LErr) {
    return result;
  }
  return obj;
}

export function getattr(env: LObject, args: Array<LVal>): LVal {
  const err = typecheck("getattr", args, 2, ["OBJECT", "ARRAY"], []);
  if (err !== undefined) {
    return err;
  }
  let obj: LVal = args[0];
  // @ts-ignore  typechecked above
  let attrs: Array<LVal> = args[1].cell;

  for (let attr of attrs) {
    if (!(obj instanceof LObject)) {
      return new LErr(
        `TypeError: only OBJECTs have attributes, not ${obj.type}`
      );
    }
    let candidate;
    if (attr instanceof LSym) {
      candidate = obj.get(attr.s);
    } else if (attr instanceof LString) {
      candidate = obj.get(attr.s);
    } else {
      return new LErr(`getattr requires SYM or STRING, not ${attr.type}`);
    }

    if (candidate.type === "ERROR") {
      return candidate;
    }
    obj = candidate;
  }

  return obj;
}

export function keys(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 1) {
    return new LErr("TypeError: keys takes 1 argument");
  }
  let arg = args[0]
  if (!(arg instanceof LObject)) {
    return new LErr(`TypeError: keys requires OBJECT not ${arg.type}`)
  }
  return new LArray(arg.keys().map((k) => new LString(k)));
}

export function values(env: LObject, args: Array<LVal>): LVal {
  if (args.length !== 1) {
    return new LErr("TypeError: values takes 1 argument");
  }
  let arg = args[0]
  if (!(arg instanceof LObject)) {
    return new LErr(`TypeError: values requires OBJECT not ${arg.type}`)
  }
  return new LArray(arg.values());
}
