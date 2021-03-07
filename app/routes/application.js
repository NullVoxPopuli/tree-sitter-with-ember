import Route from '@ember/routing/route';
import Parser from 'web-tree-sitter';

export default class ApplicationRoute extends Route {
  async beforeModel() {
    await Parser.init();
  }

  async model() {
    let parser = new Parser();
    let Lang = await Parser.Language.load(
      '/tree-sitter/tree-sitter-javascript.wasm'
    );
    parser.setLanguage(Lang);
    let tree = parser.parse(`
      let x = 1;
      let y = 2;
    `);

    console.log(tree.rootNode);
    return tree.rootNode.toString();
  }
}
