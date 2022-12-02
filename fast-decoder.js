// Copyright 2022 Divy Srivastava. All rights reserved. MIT license.

const UTF8_ACCEPT = 0;
const UTF8_REJECT = 12;

// deno-fmt-ignore
const utf8d = Uint8Array.of(
  // The first part of the table maps bytes to character classes that
  // to reduce the size of the transition table and create bitmasks.
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 11, 6, 6, 6, 5, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,

  // The second part is a transition table that maps a combination
  // of a state of the automaton and a character class to a state.
    0, 12, 24, 36, 60, 96, 84, 12, 12, 12, 48, 72, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    12, 0, 12, 12, 12, 12, 12, 0, 12, 0, 12, 12, 12, 24, 12, 12, 12, 12, 12, 24, 12, 24, 12, 12,
    12, 12, 12, 12, 12, 12, 12, 24, 12, 12, 12, 12, 12, 24, 12, 12, 12, 12, 12, 12, 12, 24, 12, 12,
    12, 12, 12, 12, 12, 12, 12, 36, 12, 36, 12, 12, 12, 36, 12, 12, 12, 12, 12, 36, 12, 36, 12, 12,
    12, 36, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12
);

const { fromCharCode } = String;

const xfffd = fromCharCode(0xFFFD);

function decode1(byte) {
  const type = utf8d[byte];
  const codepoint = (0xff >> type) & (byte);
  return fromCodePoint(codepoint);
}

let codepoint;
let state = 0;
function decodeWithState(byte) {
  const type = utf8d[byte];
  codepoint = state !== UTF8_ACCEPT
    ? (byte & 0x3f) | (codepoint << 6)
    : (0xff >> type) & (byte);
  state = utf8d[256 + state + type];
  return state;
}

function fromCodePoint(codepoint) {
  return codepoint <= 0xFFFF
    ? fromCharCode(codepoint)
    : fromCharCode(
      0xD7C0 + (codepoint >> 10),
      0xDC00 + (codepoint & 0x3FF)
    );
}

const decoders = {
  0: () => "",
  1: (c0) => decode1(c0),
};

const data = new TextEncoder().encode("D");

Deno.bench("decode(1)", () => {
  decoders[data.length](data[0]);
});

Deno.bench("core.decode(1)", () => {
  Deno.core.decode(data);
});

Deno.bench("textdecoder.decode(1)", () => {
  new TextDecoder().decode(data);
});

for (let i = 2; i <= 11; i++) {
  const args = Array.from({ length: i }, (_, j) => `c${j}`);
  const fn = new Function(
    "decodeWithState",
    "state",
    "codepoint",
    "fromCharCode",
    `return function (${args.join(", ")}) {
    let str = '';
    ${
      args.map((arg, _) =>
        `if (decodeWithState(${arg}) === 1) {
        str = xfffd + fromCharCode(codepoint);
        state = codepoint = 0;
    } else {
      if (codepoint <= 0xFFFF) {
        str += fromCharCode(codepoint);
      } else {
        str += fromCharCode(
          0xD7C0 + (codepoint >> 10),
          0xDC00 + (codepoint & 0x3FF)
        );
      }
    }`
      ).join("\n")
    }
    return str;
  }`,
  );
  decoders[i] = fn(decodeWithState, state, codepoint, fromCharCode);

  const d = new TextEncoder().encode("D".repeat(i));
  const f = new Function(
    "decoders",
    "d",
    `return decoders[${args.length}](${
      args.map((_, j) => `d[${j}]`).join(", ")
    })`,
  );

  f(decoders, d); // Warm up
  Deno.core.decode(d); // Warm up

  Deno.bench(`utf8 decode ${i}`, () => {
    f(decoders, d);
  });
  Deno.bench(`core.decode ${i}`, () => {
    Deno.core.decode(d);
  });
  Deno.bench(`textdecoder ${i}`, () => {
    new TextDecoder().decode(d);
  });
}
