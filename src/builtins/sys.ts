import PromptSync from "prompt-sync";
import { LVal, LObject, LErr, LNum, NIL, LNil, LString } from "../lval";

export function print(env: LObject, args: Array<LVal>): LNil {
  console.log(args.map((a) => a.print()).join(" "));
  return NIL;
}

export function input(env: LObject, args: Array<LVal>): LVal {

  let prompt: string;
  if (args.length === 0) {
    prompt = "";
  } else if (args.length === 1) {
    const arg = args[0];
    if (!(arg instanceof LString)) {
      return new LErr(`TypeError: input takes STRING, not ${arg.type}`);
    }
    prompt = arg.s;
  } else {
    return new LErr(`TypeError: input takes at most one argument. Received ${args.length}`)
  }

  return new LString(PromptSync()(prompt))
}


export function env(env: LObject, args: Array<LVal>) {
  if (args.length !== 0) {
    return new LErr(`TypeError: env takes 0 arguments, received ${args.length}`)
  }
  return env;
}

export function exit(env: LObject, args: Array<LVal>) {
  if (args.length > 1) {
    return new LErr(`TypeError: exit takes at most 1 argument, recieved ${args.length}`);
  }

  let code: number
  if (args.length === 0) {
    code = 0;
  } else {
    const arg = args[0];
    if (!(arg instanceof LNum)) {
      return new LErr(`TypeError: exit takes NUMBER not ${arg.type}`);
    }
    code = arg.num;
  }

  process.exit(code);
}
