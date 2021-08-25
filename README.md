# experiments

Various experiments, mostly related to my js13kGames entries.

Feel free to use any parts if you find it useful.

Games and gamejam entries:
  * https://github.com/gheja/bokosan
  * https://github.com/gheja/lost13k
  * https://github.com/gheja/glitch13k
  * https://github.com/gheja/jamcraft2018
  * https://github.com/gheja/js13k2020
  * https://github.com/gheja/offline13k
  * https://github.com/gheja/untitled13

More projects:
  * https://github.com/gheja/jseffects
  * https://github.com/gheja/fbtest
  * https://github.com/gheja/jsstuffs
  * https://github.com/gheja/trilateration.js


## Compiling TypeScript to JavaScript

There are many ways to compile TypeScript but I prefer using Node.js and the
[typescript-compiler](https://www.npmjs.com/package/typescript-compiler)
package, called from a build script.

So my preferred method is:
  * install Node.js (using the system's package manager or from https://nodejs.org/ )
  * install [typescript-compiler](https://www.npmjs.com/package/typescript-compiler)
  * compile the files using tsc

On Linux after installing Node.js:

```
npm install typescript-compiler
$HOME/node_modules/.bin/tsc *.ts
```


## TypeScript and Google Closure Compiler

As I'm mostly using these scripts in js13kGames gamejam entreis I also use
[Google Closure Compiler](https://developers.google.com/closure/compiler)
to minimize my javascript files. TypeScript is not directly supported but fortunately
[typescript-closure-compiler](https://www.npmjs.com/package/typescript-closure-compiler)
creates javascript files with the proper annotations for Closure Compiler,
and both are in the npm registry.

So my preferred method is:
  * install Node.js (using the system's package manager or from https://nodejs.org/ )
  * install [typescript-closure-compiler](https://www.npmjs.com/package/typescript-closure-compiler) and
  [google-closure-compiler](https://www.npmjs.com/package/google-closure-compiler)
  * compile the files using tscc

On Linux after installing Node.js:

```
npm install typescript-closure-compiler google-closure-compiler
$HOME/node_modules/.bin/tscc *.ts
$HOME/node_modules/.bin/google-closure-compiler --compilation_level ADVANCED --js_output_file out.min.js *.js
```

Note: tscc requires a file name, without one it fails to run.

Note 2: on the last line the *.js matches the output but the compiler ignores that.

Note 3: Google Closure Compiler has a lot of options, you might want to check them.
