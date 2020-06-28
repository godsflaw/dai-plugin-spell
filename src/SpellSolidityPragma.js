const template = `
pragma solidity _SOLIDITY_VERSION_;
`;

export default class SpellSolidityPragma {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.pragma) {
      if (_config.pragma.hasOwnProperty(key)) {
        this.replace[key] = _config.pragma[key];
      }
    }
  }

  build() {
    let before;
    let result = template;

    do {
      before = result;
      for (var key in this.replace) {
        if (this.replace.hasOwnProperty(key)) {
          result = result.replace('_' + key + '_', this.replace[key]);
        }
      }
    } while (result.localeCompare(before) !== 0);

    return result;
  }
}
