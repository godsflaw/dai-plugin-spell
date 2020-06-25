var template = `
pragma solidity _SOLIDITY_VERSION_;
`;

export default class SpellSolidityPragma {
  constructor() {
    // TODO(cmooney): get this from the real config (stubbed out)
    let config = {
      general: {},
      pragma: {}
    };
    config.pragma['_SOLIDITY_VERSION_'] = '0.5.12';

    this.replace = {};

    for (let key in config.general) {
      if (config.general.hasOwnProperty(key)) {
        this.replace[key] = config.general[key];
      }
    }

    for (let key in config.pragma) {
      if (config.pragma.hasOwnProperty(key)) {
        this.replace[key] = config.pragma[key];
      }
    }
  }

  build() {
    let result = template;

    for (var key in this.replace) {
      if (this.replace.hasOwnProperty(key)) {
        result = result.replace(key, this.replace[key]);
      }
    }

    return result;
  }
}
