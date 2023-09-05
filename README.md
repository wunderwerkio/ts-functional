# @wunderwerk/ts-functional

The purpose of this library is to bring functional programming concepts to TypeScript.

## Contents

- [Installation](#installation)
- [Results](#results)
  - [Concept](#concept)
  - [Result-Methods](#result-methods)
    - [`expect`](#expect)
    - [`expectErr`](#expecterr)
    - [`unwrap`](#unwrap)
    - [`unwrapOr`](#unwrapor)
  - [Result utility functions](#result-utility-functions)
    - [`wrap`](#wrap)
    - [`wrapAsync`](#wrapasync)
  - [Example](#result-example)

## Installation

```sh
npm install @wunderwerk/ts-functional
```

## Results

TypeScript implementation of the `Result` type. Heavily inspired by Rust's implementation.

The main benefit of using the `Result` type is to avoid `try-catch` blocks. By utilizing TypeScripts type system a function returning a `Result` type carries both the success and error value, which can be easily narrowed down to the correct type using `if` statements. 

### Concept

A result contains either an error OR the success value.
Therefore, to successfully return a `Result` type, a function must return the success value wrapped in `Ok()` and the error value wrapped in `Err()`.

The successful result results in the following object:

```ts
{
  ok: true,
  err: false,
  val: {} // Whatever successful value.
  // Other methods...
}
```

On the other hand, a error result looks as follows:

```ts
{
  ok: false,
  err: true,
  val: {} // Whatever error value.
  // Other methods...
}
```

The happy / unhappy path can now easily be handled by just using if-else statements, instead of
try-catch blocks.

### Result-Methods

The result provides additional methods:

#### `expect`

Returns the contained successful value, throws an `Error` with the provided argument as the error message, if the result is not successful.

```ts
const result = getResultSomehow();

const successValue = result.expect('Result must be successful!');
```

#### `expectErr`

The exact opposite to `expect`. Returns the contained error value, throws an `Error` with the provided argument as the error message, if the result is successful.

```ts
const result = getResultSomehow();

const successValue = result.expectErr('Result must fail');
```

#### `unwrap`

Same as `expect`, except without the ability to provide a custom error message.

```ts
const result = getResultSomehow();

const successValue = result.unwrap();
```

#### `unwrapOr`

Returns the contained successful value, or the provided `Or` value, if the result is not successful.

```ts
const result = getResultSomehow();

const successValueOrDefault = result.unwrapOr('this is the fallback value');
```

### Result utility functions

#### `wrap`

Wraps the given function in a try-catch block and returns the successful value as `Ok` and the catched error as `Err`.

```ts
import { wrap } from "@wunderwerk/ts-functional/results";

// isEven now returns a result.
const isEven = wrap((input: number) => {
  if (input % 2 === 0) {
    return true;
  }

  throw new Error('input is not even!');
});

const result = isEven(2);
```

#### `wrapAsync`

Same as `wrap` but awaits the given function and returns the result in a promise.

```ts
import { wrapAsync } from "@wunderwerk/ts-functional/results";

// fetchData now returns a promise with a result.
const fetchData = wrapAsync(async () => {
  const response = await fetch('https://my-api.com');
  return await response.json();
});

const result = await fetchData();
```

### Result Example

**Fetching data**

```ts
import { Result, Ok, Err, wrapAsync } from "@wunderwerk/ts-functional/results";

interface FetchedData {
  title: string;
}

const fetchSomething = wrapAsync(async () => {
  const response = await fetch('https://my-api.com');
  return await response.json() as FetchedData; 
});

// This is effectively the same as:
// async function fetchSomething(): Result<FetchedData, Error> {
//   try {
//     const response = await fetch('https://my-api.com');
//     const data = await response.json() as FetchedData; 
//
//     return Ok(data);
//   } catch (e) {
//     return Err(e);
//   }
// }

const result = await fetchSomething();

// By checking result.err, we check if the result is an error.
// Withing the if statement, the result.val has been narrowed down to the error result.
if (result.err) {
  console.error("Oh no, an error happened:", result.val.message);
  return;
}

// Because the error is already handled, result.val is now the success result, meaning
// we can safely process the happy-path now.
console.log("Hurray, the fetch was successful and returned the following data:", result.val);
```
