#!/usr/bin/env node

import { handleError } from "./builtins/imports";
import Interpreter from "./interpreter"
import { loadFile } from "./lib/load";
import { LErr, lvalRead } from "./lval";
// @ts-ignore
import parser from "./grammar/zug.js";


interface UserInterface {
    print(_: string): null;
    error(_: string): null;
    input(): string;
    readFile(): Array<string>;

    interactive: boolean;
    testing: boolean;
  }


export function main(userInterface: UserInterface) {

    const interpreter = new Interpreter();
    let res = loadFile(interpreter.env, "prelude", true);
    if (res instanceof LErr) {
      throw new Error("Failed to load prelude: " + res.s);
    }

    if (userInterface.interactive) {
        userInterface.print("zug version 0.2.0");
        userInterface.print("press ctrl+d to exit");

        while (true) {
            const line = userInterface.input();
            if (!line) {
                continue;
            }

            try {
                var tree = parser.parse(line);
            } catch (err) {
                handleError(err, line);
                continue
            }

            const result = interpreter.interpret(lvalRead(tree));
            if (result instanceof LErr) {
                userInterface.error(result.print());
            } else {
                userInterface.print(result.print());
            }
        }
    } else if (userInterface.testing) {
        // TODO!
        return;
    } else {
        let lines = userInterface.readFile();
        for (let k=0; k<lines.length; k++) {
            const line = lines[k];
            try {
                var tree = parser.parse(line);
            } catch(err) {
                userInterface.error(
                    `SytaxError: line ${k}`
                );
                handleError(err, line);
                continue
            }

            const result = interpreter.interpret(lvalRead(tree));
            if (result instanceof LErr) {
                userInterface.error(result.print());
                break;
            }
        }

    }
}
