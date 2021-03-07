import Component from '@glimmer/component';
import { tracked, cached } from '@glimmer/tracking';
import { action } from '@ember/object';
import { use, Resource } from 'ember-could-get-used-to-this';

// import Monaco from 'monaco-editor';
import Parser from 'web-tree-sitter';
import Tomorrow from 'monaco-tree-sitter/themes/tomorrow';
// import JS from 'tree-sitter-javascript/grammar';
import HBS from 'tree-sitter-glimmer/grammar';
// import TS from 'tree-sitter-typescript/typescript/grammar';
import {
  Language,
  Theme,
  // MonacoTreeSitter,
  highlight,
} from 'monaco-tree-sitter';

export default class EditorComponent extends Component {
  availableLanguages = Object.keys(STARTING_SAMPLES);

  @tracked code = STARTING_SAMPLES.hbs;
  @tracked language = 'hbs';

  // @use editor = new Editor(() => [this.language]);
  @use highlighted = new Highlighter(() => [this.language, this.code]);

  @action
  updateCode(e) {
    this.code = e.target.value;
  }
}

const GRAMMAR = {
  hbs: HBS,
  // js: JS,
};
const WASM_PATHS = {
  hbs: '/tree-sitter/tree-sitter-glimmer',
  js: '/tree-sitter/tree-sitter-javascript',
  ts: '/tree-sitter/tree-sitter-typescript',
};

class Highlighter extends Resource {
  @tracked html;
  @tracked language;

  get _language() {
    return this.args.positional[0];
  }

  get code() {
    return this.args.positional[1];
  }

  get value() {
    if (this.language) {
      return highlight(this.code, this.language, true);
    }

    return '';
  }

  @action
  async setupLanguage() {
    const language = new Language(GRAMMAR[this._language]);
    await language.init(WASM_PATHS[this._language], Parser);

    this.language = language;
  }

  async setup() {
    // Theme can be loaded before Parser.init()
    Theme.load(Tomorrow);

    await Parser.init();
    await this.setupLanguage();
  }

  update() {
    this.setupLanguage();
  }
}

class Editor extends Resource {
  @tracked editor;

  get language() {
    return this.args.positional[0];
  }

  get value() {
    return this.editor;
  }

  @action
  async setupLanguage() {
    const language = new Language(GRAMMAR[this.language]);
    await language.init(WASM_PATHS[this.language], Parser);

    // Uncomment this line for a pure code highlighter
    this.colorized = document.body.innerHTML = highlight(cppCode, language, true);
    // let element = document.querySelector('editor-container');

    // window.editor = this.editor = Monaco.editor.create(element, {
    //   value: '',
    //   language: this.language,
    // });

    // window.monacoTreeSitter = new MonacoTreeSitter(
    //   Monaco,
    //   this.editor,
    //   language
    // );
  }

  async setup() {
    // Theme can be loaded before Parser.init()
    Theme.load(Tomorrow);

    await Parser.init();
    await this.setupLanguage();
  }

  update() {
    this.setupLanguage();
  }
}

const STARTING_SAMPLES = {
  js: `
    export default setComponentTemplate(
      hbs\`
        Num: {{this.num}}
      \`,
      class extends Component {
        @tracked num = 0;
      });
    );
  `,
  ts: `
    export default setComponentTemplate(
      hbs\`
        Num: {{this.num}}
      \`,
      class extends Component {
        @tracked num = 0;
      });
    );
  `,
  hbs: `
    <label>
      {{@label}}
      <input value={{@value}} {{on 'input' this.update}}>
    </label>

    {{yield}}
  `,
};
