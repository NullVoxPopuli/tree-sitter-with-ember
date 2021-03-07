# tree-sitter-with-ember

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Notes

1. web-tree-sitter
  - is not a real browser package, requires node modules to be stubbed via webpack: `fs: "empty"`
    - configured in `ember-cli-build.js`

2. need to build WASM packages for each language in order to get WASM bindings
  - each language needs to be installed in the package.json separately
  - requires installation of `tree-sitter-cli`

3. tree-sitter-glimmer
  - not published, checked out via github reference
  - has a dep on husky, which means using the github reference doesn't work with vanilla yarn.
    To install deps for this app, we must use
    - `yarn install --ignore-scripts`
    - `yarn add <package name> --ignore-scripts`

4. Add script to build all the WASM bindings for the languages we want
  - for building in `ember-cli-build.js`:
    - install `execa` to run `npx tree-sitter`

5. Try to init the Parser in the application route, following the web-tree-sitter README:
  - error: `RuntimeError: abort(RuntimeError: abort(both async and sync fetching of the wasm failed). Build with -s ASSERTIONS=1 for more info.). Build with -s ASSERTIONS=1 for more info.`
    - this is due to the WASM output files not being copied to the public / output directory
    - output is placed in the CWD.
  - network requests show that there is a request to `/tree-sitter.wasm`, but we've built our WASM bindings into `/tree-sitter/*`
    - we can customize the paths of the language wasm files, but not the main tree-sitter.wasm

6. Using monaco-tree-sitter, the individual grammar definitions need to be configured to be used by monaco.
   - error: `grammar` is not defined. `grammar` is not required by these modules,
     so we need to figure out where it comes from and define it on `window`

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd tree-sitter-with-ember`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
