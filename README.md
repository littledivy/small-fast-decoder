Fast UTF-8 text decoder for small (<20 bytes) data. (POC to be merged in Deno)

```
deno bench -A --unstable fast-encoder.js
cpu: Apple M1
runtime: deno 1.24.3 (aarch64-apple-darwin)

file:///Users/divy/gh/deno/fast-encoder.js
benchmark                  time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------- -----------------------------
decode(1)              650.29 ps/iter   (620.8 ps … 17.71 ns)  633.3 ps    850 ps    925 ps
core.decode(1)          93.32 ns/iter  (91.53 ns … 113.53 ns)   93.4 ns 103.73 ns 104.57 ns
textdecoder.decode(1)  765.67 ns/iter  (752.6 ns … 819.05 ns) 762.75 ns 819.05 ns 819.05 ns
utf8 decode 2           31.13 ns/iter   (29.98 ns … 38.73 ns)  30.65 ns  35.22 ns  35.73 ns
core.decode 2           93.83 ns/iter    (91.6 ns … 100.4 ns)  94.38 ns  99.19 ns  99.98 ns
textdecoder 2           756.5 ns/iter (750.65 ns … 775.69 ns) 757.21 ns 775.69 ns 775.69 ns
utf8 decode 3           22.43 ns/iter   (21.88 ns … 28.62 ns)  22.09 ns  26.99 ns  27.11 ns
core.decode 3          101.75 ns/iter   (99.06 ns … 109.9 ns) 102.29 ns 107.49 ns 108.14 ns
textdecoder 3             763 ns/iter  (757.1 ns … 800.23 ns) 763.91 ns 800.23 ns 800.23 ns
utf8 decode 4           32.29 ns/iter    (31.6 ns … 38.34 ns)  31.96 ns  36.55 ns  37.09 ns
core.decode 4           102.2 ns/iter  (99.42 ns … 119.91 ns)  102.5 ns 108.47 ns    112 ns
textdecoder 4          756.68 ns/iter (751.27 ns … 783.05 ns) 757.55 ns 783.05 ns 783.05 ns
utf8 decode 5           40.61 ns/iter   (39.28 ns … 45.97 ns)  40.28 ns  44.85 ns  44.92 ns
core.decode 5          102.16 ns/iter (100.07 ns … 112.86 ns) 102.67 ns 107.47 ns 108.13 ns
textdecoder 5          758.31 ns/iter (753.14 ns … 766.53 ns) 759.39 ns 766.53 ns 766.53 ns
utf8 decode 6           48.55 ns/iter   (47.08 ns … 53.66 ns)  47.99 ns   52.8 ns  53.05 ns
core.decode 6          102.65 ns/iter (100.51 ns … 112.25 ns) 103.32 ns 108.54 ns 109.55 ns
textdecoder 6          758.87 ns/iter (752.82 ns … 762.79 ns) 760.24 ns 762.79 ns 762.79 ns
utf8 decode 7           57.13 ns/iter   (55.33 ns … 66.17 ns)  59.75 ns  61.14 ns  61.55 ns
core.decode 7           102.6 ns/iter (100.37 ns … 110.36 ns) 103.25 ns 107.73 ns 108.38 ns
textdecoder 7          759.63 ns/iter  (754.48 ns … 776.3 ns) 760.52 ns  776.3 ns  776.3 ns
utf8 decode 8            65.4 ns/iter   (63.37 ns … 70.27 ns)  68.17 ns  69.59 ns  69.88 ns
core.decode 8          101.69 ns/iter  (99.43 ns … 111.56 ns) 102.32 ns 107.22 ns 107.66 ns
textdecoder 8          760.49 ns/iter (755.83 ns … 765.37 ns) 761.73 ns 765.37 ns 765.37 ns
utf8 decode 9           76.62 ns/iter     (74.4 ns … 85.1 ns)  79.12 ns   80.7 ns  81.18 ns
core.decode 9          101.45 ns/iter  (99.27 ns … 108.09 ns)  102.1 ns 106.26 ns 106.65 ns
textdecoder 9          762.97 ns/iter (757.81 ns … 778.67 ns) 763.89 ns 778.67 ns 778.67 ns
utf8 decode 10          89.12 ns/iter  (86.51 ns … 101.79 ns)  91.56 ns  93.41 ns  95.63 ns
core.decode 10         102.74 ns/iter (100.12 ns … 151.41 ns) 102.81 ns 119.42 ns 124.69 ns
textdecoder 10         774.75 ns/iter  (759.5 ns … 808.12 ns) 785.93 ns 808.12 ns 808.12 ns
utf8 decode 11         100.91 ns/iter  (97.95 ns … 105.55 ns) 103.36 ns 104.66 ns 104.83 ns
core.decode 11         102.23 ns/iter  (100.09 ns … 114.2 ns) 102.78 ns  107.8 ns 108.28 ns
textdecoder 11         769.74 ns/iter (764.76 ns … 774.16 ns)  771.1 ns 774.16 ns 774.16 ns
```
