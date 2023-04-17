import test from "ava";
import { Err, Ok, wrap, wrapAsync } from "../src/results/index.js";

/**
 * Ok Result.
 */

test("Ok properties", (t) => {
  const result = Ok("value");

  t.assert(result.ok);
  t.assert(result.err === false);
  t.is(result.val, "value");
});

test("Ok expect", (t) => {
  const result = Ok("value");

  t.is(result.expect("expected value"), "value");
});

test("Ok expectErr", (t) => {
  const result = Ok("value");

  t.throws(() => {
    result.expectErr("should fail");
  });
});

test("Ok unwrap", (t) => {
  const result = Ok("value");

  t.is(result.unwrap(), "value");
});

test("Ok unwrapOr", (t) => {
  const result = Ok("value");

  t.is(result.unwrapOr("default"), "value");
});

/**
 * Err Result.
 */

test("Err properties", (t) => {
  const result = Err("value");

  t.assert(result.err);
  t.assert(result.ok === false);
  t.is(result.val, "value");
});

test("Err expect", (t) => {
  const result = Err("value");

  t.throws(() => {
    result.expect("should fail");
  });
});

test("Err expectErr", (t) => {
  const result = Err("value");

  t.is(result.expectErr("expected value"), "value");
});

test("Err unwrap", (t) => {
  const result = Err("value");

  t.throws(() => {
    result.unwrap();
  });

  const object = { key: "value" };
  const result2 = Err(object);

  t.throws(
    () => {
      result2.unwrap();
    },
    {
      message: (m) => m.includes(JSON.stringify(object)),
    }
  );
});

test("Err unwrapOr", (t) => {
  const result = Err("value");

  t.is(result.unwrapOr("default"), "default");
});

/**
 * wrap().
 */

test("wrap() with Ok", (t) => {
  const operation = () => {
    return "yes!";
  };

  const result = wrap(operation);

  t.assert(result.ok);
});

test("wrap() with Err", (t) => {
  const operation = () => {
    throw new Error("no!");
  };

  const result = wrap(operation);

  t.assert(result.err);
});

/**
 * wrapAsync().
 */

test("wrapAsync() with Ok", async (t) => {
  const operation = () => Promise.resolve("yes!");

  const result = await wrapAsync(operation);

  t.assert(result.ok);
});

test("wrapAsync() with Err", async (t) => {
  const operation = () => Promise.reject(new Error("no!"));

  const result = await wrapAsync(operation);

  t.assert(result.err);
});
