'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const execa = require('execa');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const { mv } = require('broccoli-stew');

function WASMBindings() {
  const root = process.cwd();
  const buildDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'tree-sitter--wasm-bindings')
  );
  const languages = ['javascript', 'typescript/typescript', 'glimmer'];

  for (let language of languages) {
    execa.sync(
      'npx',
      [
        'tree-sitter',
        'build-wasm',
        `${root}/node_modules/tree-sitter-${language}`,
      ],
      { cwd: buildDir, stdio: 'inherit', shell: 'bash' }
    );
  }

  let tsBindings = mv(
    'node_modules/web-tree-sitter',
    'tree-sitter.wasm',
    'tree-sitter.wasm'
  );

  let languageBindings = new Funnel(buildDir, {
    destDir: '/tree-sitter/',
  });
  return mergeTrees([tsBindings, languageBindings]);
}

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here

    autoImport: {
      webpack: {
        node: {
          // web-tree-sitter is not a real browser package
          fs: 'empty',
        },
      },
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return mergeTrees([app.toTree(), WASMBindings()]);
};
