// TODO(cmooney): figure out what we want to do here.
// 1. include just the abstracts
// 2. expand the abstracts for easy verification
var template = `
import "ds-math/math.sol";

import "lib/dss-interfaces/src/dss/VatAbstract.sol";
import "lib/dss-interfaces/src/dapp/DSPauseAbstract.sol";
`;

export default class SpellInclude {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.include) {
      if (_config.include.hasOwnProperty(key)) {
        this.replace[key] = _config.include[key];
      }
    }
  }

  build() {
    let result = template;

    for (var key in this.replace) {
      if (this.replace.hasOwnProperty(key)) {
        result = result.replace('_' + key + '_', this.replace[key]);
      }
    }

    return result;
  }
}
