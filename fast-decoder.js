// Copyright 2022 Divy Srivastava. All rights reserved. MIT license.

// deno-fmt-ignore
var utf8d = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    0xa, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x4, 0x3, 0x3,
    0xb, 0x6, 0x6, 0x6, 0x5, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8,
    0x0, 0x1, 0x2, 0x3, 0x5, 0x8, 0x7, 0x1, 0x1, 0x1, 0x4, 0x6, 0x1, 0x1, 0x1, 0x1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1,
    1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

const { fromCharCode } = String;

const xfffd = fromCharCode(0xFFFD);

function decode1(byte) {
  const type = utf8d[byte];
  const codepoint = (0xff >> type) & (byte);
  return (codepoint <= 0xFFFF ? fromCharCode(codepoint) : fromCharCode(
    0xD7C0 + (codepoint >> 10),
    0xDC00 + (codepoint & 0x3FF),
  ));
}

let codepoint;
let state = 0;
function decodeWithState(byte) {
  var type = utf8d[byte];
  codepoint = (state !== 0)
    ? (byte & 0x3f) | (codepoint << 6)
    : (0xff >> type) & (byte);
  state = utf8d[256 + state * 16 + type];
  return state;
}

function codepointThing(codepoint) {
  return codepoint <= 0xFFFF
    ? fromCharCode(codepoint)
    : fromCharCode(0xD7C0 + (codepoint >> 10), 0xDC00 + (codepoint & 0x3FF));
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
