Fast UTF-8 text decoder for small (<20 bytes) data. (POC to be merged in Deno)

```
deno bench -A --unstable fast-encoder.js
cpu: Apple M1
runtime: deno 1.24.3 (aarch64-apple-darwin)

file:///Users/divy/gh/deno/fast-encoder.js
benchmark                  time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------- -----------------------------
decode(1)              655.97 ps/iter   (620.8 ps … 47.73 ns)  633.4 ps  779.2 ps  791.7 ps
core.decode(1)            126 ns/iter (122.65 ns … 234.02 ns) 125.33 ns  143.3 ns 144.65 ns
textdecoder.decode(1)  866.22 ns/iter (858.72 ns … 883.67 ns) 867.38 ns 883.67 ns 883.67 ns
utf8 decode 2           68.03 ns/iter   (66.65 ns … 85.02 ns)   67.8 ns   72.3 ns  73.15 ns
core.decode 2          126.45 ns/iter  (124.8 ns … 142.65 ns) 126.43 ns 133.22 ns  136.4 ns
textdecoder 2          873.39 ns/iter (867.78 ns … 898.83 ns)  874.6 ns 898.83 ns 898.83 ns
utf8 decode 3           52.06 ns/iter   (50.64 ns … 61.58 ns)  52.03 ns  56.73 ns  57.94 ns
core.decode 3          133.48 ns/iter  (132.37 ns … 141.1 ns)  133.4 ns 138.47 ns 139.63 ns
textdecoder 3          874.08 ns/iter (868.75 ns … 879.29 ns) 875.21 ns 879.29 ns 879.29 ns
utf8 decode 4            67.5 ns/iter   (66.37 ns … 73.71 ns)  67.49 ns  72.08 ns  73.04 ns
core.decode 4          133.77 ns/iter (132.49 ns … 140.39 ns)  133.8 ns 139.19 ns 139.89 ns
textdecoder 4          876.01 ns/iter (868.92 ns … 893.05 ns) 877.55 ns 893.05 ns 893.05 ns
utf8 decode 5           81.34 ns/iter   (79.32 ns … 86.77 ns)  81.19 ns  86.23 ns  86.56 ns
core.decode 5          134.07 ns/iter (132.95 ns … 142.88 ns) 134.09 ns 139.39 ns 141.22 ns
textdecoder 5          878.69 ns/iter (872.98 ns … 883.75 ns) 880.45 ns 883.75 ns 883.75 ns
utf8 decode 6           94.87 ns/iter  (91.42 ns … 136.96 ns)  96.56 ns 119.96 ns  124.5 ns
core.decode 6          135.91 ns/iter (132.86 ns … 167.54 ns)    136 ns 152.77 ns 155.59 ns
textdecoder 6          876.95 ns/iter (871.34 ns … 884.39 ns) 878.16 ns 884.39 ns 884.39 ns
utf8 decode 7          106.33 ns/iter  (104.03 ns … 120.8 ns) 109.02 ns 112.65 ns 115.82 ns
core.decode 7          135.55 ns/iter (133.35 ns … 150.58 ns)  135.4 ns 144.47 ns 150.52 ns
textdecoder 7           878.4 ns/iter (871.98 ns … 907.71 ns)  879.9 ns 907.71 ns 907.71 ns
utf8 decode 8          119.01 ns/iter (117.03 ns … 123.54 ns) 121.71 ns 123.24 ns 123.44 ns
core.decode 8          133.88 ns/iter (132.38 ns … 145.17 ns) 133.72 ns 139.66 ns  140.7 ns
```
