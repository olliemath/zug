import { LErr, LObject, LString, LVal } from "../lval";
// @ts-ignore
import { loadFile } from "../lib/load";

export function import_(env: LObject, args: Array<LVal>): LVal {
  const module = args[0];
  if (!(module instanceof LString)) {
    return new LErr(`load requires STRING, not ${module.type}`);
  }

  return loadFile(env, module.s, false);
}

export function handleError(err: any, line: string) {
  if (!err.hasOwnProperty("location")) throw err;

  console.log(err.message);
  console.log(
    '"' +
      line.slice(err.location.start.offset - 2, err.location.start.offset) +
      redText(line.slice(err.location.start.offset, err.location.end.offset)) +
      line.slice(err.location.end.offset, err.location.end.offset + 2) +
      '"'
  );
}

export function redText(text: String): String {
  return "\x1b[31m" + text + "\x1b[0m";
}
