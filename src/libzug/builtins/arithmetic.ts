import { LVal, LNum, LObject, LErr } from "../lval";

function extractNumbers(args: Array<LVal>): Array<number> {
  // Extract numbers from the LVals or throw an error
  let result = [];
  for (let arg of args) {
    if (arg instanceof LNum) {
      result.push(arg.num);
    } else {
      throw new Error(`TypeError: ${arg.type} is not a number`);
    }
  }
  return result;
}

export function add(env: LObject, args: Array<LVal>): LVal {
  if (args.length == 0) {
    return new LNum(0);
  }

  try {
    var numbers = extractNumbers(args);
  } catch (err) {
    return new LErr(err.message);
  }

  let res = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    res += numbers[i];
  }
  return new LNum(res);
}

export function sub(env: LObject, args: Array<LVal>): LVal {
  if (args.length == 0) {
    return new LNum(0);
  }

  try {
    var numbers = extractNumbers(args);
  } catch (err) {
    return new LErr(err.message);
  }

  let res = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    res -= numbers[i];
  }
  return new LNum(res);
}

export function mul(env: LObject, args: Array<LVal>): LVal {
  if (args.length == 0) {
    return new LNum(1);
  }
  try {
    var numbers = extractNumbers(args);
  } catch (err) {
    return new LErr(err.message);
  }

  let res = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    res *= numbers[i];
  }
  return new LNum(res);
}

export function div(env: LObject, args: Array<LVal>): LVal {
  if (args.length == 0) {
    return new LNum(1);
  }
  try {
    var numbers = extractNumbers(args);
  } catch (err) {
    return new LErr(err.message);
  }

  let res = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    res /= numbers[i];
  }
  return new LNum(res);
}
