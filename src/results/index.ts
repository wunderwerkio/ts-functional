import { toString } from "../utils/index.js";

/**
 * Defines the common interface for all Result types.
 *
 * @template T - The type of the value in the Ok case.
 * @template TError - The type of the value in the Err case.
 */
interface BaseResult<T, TError> {
  readonly ok: boolean;
  readonly err: boolean;
  readonly val: T | TError;

  /**
   * Get the value from the Ok case, or throw an error if the Result is an Err.
   *
   * @param msg - The error message to use if the Result is an Err.
   * @throws {Error} If the Result is an Err.
   */
  expect(msg: string): T;

  /**
   * Get the value from the Err case, or throw an error if the Result is an Ok.
   *
   * @param msg - The error message to use if the Result is an Ok.
   * @throws {Error} If the Result is an Ok.
   */
  expectErr(msg: string): TError;

  /**
   * Get the value from the Ok case, or throw an error if the Result is an Err.
   *
   * @throws {Error} If the Result is an Err.
   */
  unwrap(): T;

  /**
   * Get the value from the Ok case, or return the provided default if the Result is an Err.
   *
   * @param val - The default value to return if the Result is an Err.
   */
  unwrapOr<TDefault>(val: TDefault): T | TDefault;
}

/**
 * Implements the Ok result.
 *
 * @template TError - Type of the error.
 */
export class ResultErr<TError> implements BaseResult<never, TError> {
  readonly ok = false;
  readonly err = true;
  readonly val: TError;

  /**
   * Construct new Err result.
   *
   * @param val - The error value.
   */
  public constructor(val: TError) {
    this.val = val;
  }

  /** @inheritdoc */
  public expect(msg: string): never {
    throw new Error(msg);
  }

  /** @inheritdoc */
  public expectErr(_msg: string): TError {
    return this.val;
  }

  /** @inheritdoc */
  public unwrap(): never {
    throw new Error(`unwrap() called on Error: ${toString(this.val)}`);
  }

  /** @inheritdoc */
  public unwrapOr<TDefault>(val: TDefault): TDefault {
    return val;
  }
}

/**
 * Implements the Err result.
 *
 * @template T - Type of the value.
 */
export class ResultOk<T> implements BaseResult<T, never> {
  readonly ok = true;
  readonly err = false;
  readonly val: T;

  /**
   * Construct new Ok result.
   *
   * @param val - The value.
   */
  public constructor(val: T) {
    this.val = val;
  }

  /** @inheritdoc */
  public expect(_msg: string): T {
    return this.val;
  }

  /** @inheritdoc */
  public expectErr(msg: string): never {
    throw new Error(msg);
  }

  /** @inheritdoc */
  public unwrap(): T {
    return this.val;
  }

  /** @inheritdoc */
  public unwrapOr<TDefault>(_val: TDefault): T {
    return this.val;
  }
}

/**
 * Create a new Ok result.
 *
 * @param val - The value.
 */
export const Ok = <T>(val: T) => new ResultOk(val);

/**
 * Create a new Err result.
 *
 * @param val - The error value.
 */
export const Err = <TError>(val: TError) => new ResultErr(val);

/**
 * Wraps a synchronous operation in a try/catch block
 * and returns a result.
 *
 * @param operation - The operation to wrap.
 */
export const wrap = <T, TError = unknown>(
  operation: () => T
): BaseResult<T, TError> => {
  try {
    return Ok(operation());
  } catch (err) {
    return Err(err as TError);
  }
};

/**
 * Wraps an asynchronous operation in a try/catch block
 * and returns a result.
 *
 * @param operation - The operation to wrap.
 */
export const wrapAsync = async <T, TError = unknown>(
  operation: () => Promise<T>
): Promise<BaseResult<T, TError>> => {
  try {
    return Ok(await operation());
  } catch (e) {
    return Err(e as TError);
  }
};

/**
 * Result module.
 */
export const Result = {
  Ok,
  Err,
  wrap,
  wrapAsync,
};

export type Result<T, TError> = ResultOk<T> | ResultErr<TError>;
