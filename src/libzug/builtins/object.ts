import { LErr, LObject, LString, LSym, LVal, LArray } from "../lval";
import { le } from "./conditionals";
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
  if (args.length < 2 || args.length > 3) {
    return new LErr(
      `TypeError: getattr takes 2 or 3 arguments, but got ${args.length}`
    )
  }
  let obj: LVal = args[0];
  let attr: LVal = args[1];

  if (!(obj instanceof LObject)) {
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
