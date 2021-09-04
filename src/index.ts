#!/usr/bin/env node
import { createInterface, ReadLine } from "readline";

import { handleError, redText } from "./libzug/builtins/imports";
// @ts-ignore
import parser from "./libzug/grammar/zug.js";
import Interpreter from "./libzug/interpreter";
import { loadFile } from "./libzug/lib/load";
import { LErr, lvalRead } from "./libzug/lval";

main();

function main() {
  // Set up line reader
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  readline.setPrompt("zug> ");

  const interpreter = new Interpreter();

  let res = loadFile(interpreter.env, "prelude", true);
  if (res instanceof LErr) {
    throw new Error("Failed to load prelude: " + res.s);
  }

  console.log("zug version 0.2.0");
  console.log("press ctrl+d to exit");
  readline.prompt();

  readline.on("line", (line) => {
    if (line) {
      try {
        var tree = parser.parse(line);
      } catch (err) {
        handleError(err, line);
        readline.prompt();
        return;
      }

      let result = interpreter.interpret(lvalRead(tree));
      if (result.type === "ERROR") {
        console.log(redText(result.print()));
      } else {
        console.log(result.print());
      }
    }
    readline.prompt();
  });

  readline.on("SIGINT", () => {
    // @ts-ignore
    readline.clearLine();
    readline.prompt();
  });

  readline.on("close", () => {
    console.log("goodbye!");
    process.exit(0);
  });
}
