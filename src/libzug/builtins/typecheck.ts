import { LErr, LSym, LVal, LVec, SExpr } from "../lval";

export function typecheck(
  name: string,
  args: Array<LVal>,
  expectedArgs: number,
  argTypes: Array<string>,
  symbolic: Array<number>
): LVal | undefined {
  if (args.length !== expectedArgs) {
    return new LErr(
      `TypeError: ${name} takes ${expectedArgs} arguments, but got ${args.length}`
    );
  }

  for (let i = 0; i < argTypes.length; i++) {
    const arg = args[i];
    if (arg.type !== argTypes[i]) {
      return new LErr(
        `TypeError: ${name} requires ${argTypes[i]}, but got ${arg.type}`
      );
    }
    if (
      symbolic.indexOf(i) !== -1 &&
      (arg instanceof LVec || arg instanceof SExpr)
    ) {
      for (let child of arg.cell) {
        if (!(child instanceof LSym)) {
          return new LErr(`TypeError: ${name} expected SYM, got ${child.type}`);
        }
      }
    }
  }
}
