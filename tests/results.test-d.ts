import { Result } from "../src/results/index.js";
import { expectType } from "tsd";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Result.Err("Cannot divide by 0");
  }

  return Result.Ok(a / b);
}

function testTypeNarrowing() {
  const result = divide(1, 0);

  expectType<Result<number, string>>(result);

  if (result.err) {
    expectType<true>(result.err);
    expectType<string>(result.val);

    throw new Error(result.val);
  }

  expectType<true>(result.ok);
  expectType<number>(result.val);
}

function testExpect() {
  const result = divide(1, 0);

  expectType<number>(result.expect("Expected number"));

  if (result.err) {
    expectType<never>(result.expect("Expected number"));
  }
}

function testExpectErr() {
  const result = divide(1, 0);

  expectType<string>(result.expectErr("Expected error"));

  if (result.ok) {
    expectType<never>(result.expectErr("Expected error"));
  }
}

function testUnwrap() {
  const result = divide(1, 0);

  expectType<number>(result.unwrap());

  if (result.err) {
    expectType<never>(result.unwrap());
  }
}

function testUnwrapOr() {
  const result = divide(1, 0);

  expectType<number>(result.unwrapOr(0));

  if (result.err) {
    expectType<0>(result.unwrapOr(0));
  }
}
