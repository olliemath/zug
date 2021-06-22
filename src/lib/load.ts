import fs from "fs";

import Interpreter from "../interpreter";
import { LErr, LObject, LVal, lvalRead, NIL } from "../lval";
// @ts-ignore
import parser from "../grammar/zug.js";

export function loadFile(env: LObject, module: string, global: boolean): LVal {
  let interpreter: Interpreter;
  if (global) {
    // Only used for prelude: set globals
    interpreter = new Interpreter(env);
  } else {
    interpreter = new Interpreter(new LObject([], [], env));
  }

  // Count the number of directories up
  let up = -1;
  for (let char of module) {
    if (char === ".") {
      up += 1;
    } else {
      break;
    }
  }
  const path = module.slice(up + 1).replace(".", "/");

  // If no `.` prefix, then stdlib
  let prefix: string;
  if (up === -1) {
    prefix = __dirname + "/";
  } else {
    prefix = "./";
    for (let k = 0; k < up; k++) {
      prefix += "../";
    }
  }

  const raw: string = fs.readFileSync(prefix + path + ".zug", "utf-8");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    try {
      var tree = parser.parse(line);
    } catch (err) {
      return new LErr(`Error at line ${i} in '${module}':\n` + err);
    }

    let result = interpreter.interpret(lvalRead(tree));
    if (result.type === "ERROR") {
      const newError = `Error at line ${i} in '${module}':\n` + result.print();
      return new LErr(newError);
    }
  }

  if (global) {
    return NIL;
  }
  return interpreter.env;
}
