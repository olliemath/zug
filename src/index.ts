import PromptSync from "prompt-sync";
import History from "prompt-sync-history";

import { handleError, redText } from "./builtins/imports";
// @ts-ignore
import parser from "./grammar/zug.js";
import Interpreter from "./interpreter";
import { loadFile } from "./lib/load";
import { LErr, lvalRead } from "./lval";

main();

function main() {
  const history = History(".zug-history", 1000);
  const promptSync = PromptSync({
    sigint: false,
    // @ts-ignore  (seems to be misisng from typing)
    eot: true,
    history: history,
  });
  const interpreter = new Interpreter();
  let res = loadFile(interpreter.env, "prelude", true);
  if (res instanceof LErr) {
    throw new Error("Failed to load prelude: " + res.s);
  }

  console.log("zug version 0.2.0");
  console.log("press ctrl+d to exit");

  while (true) {
    const line = promptSync("zug> ");
    if (!line) {
      continue;
    }

    try {
      var tree = parser.parse(line);
    } catch (err) {
      handleError(err, line);
      continue;
    }

    let result = interpreter.interpret(lvalRead(tree));
    if (result.type === "ERROR") {
      console.log(redText(result.print()));
    } else {
      console.log(result.print());
    }
  }

  history.save();
}
