// TODO(cmooney): figure out what we want to do here.
// 1. include just the abstracts
// 2. expand the abstracts for easy verification
var template = `
import "ds-math/math.sol";

import "lib/dss-interfaces/src/dss/VatAbstract.sol";
import "lib/dss-interfaces/src/dapp/DSPauseAbstract.sol";
`;

export default class SpellInclude {
  constructor() {
    // TODO(cmooney): get this from the real config (stubbed out)
    let config = {
      general: {},
      include: {}
    };
    config.include['_ORGANIZATION_'] = 'MakerDAO';

    this.replace = {};

    for (let key in config.general) {
      if (config.general.hasOwnProperty(key)) {
        this.replace[key] = config.general[key];
      }
    }

    for (let key in config.include) {
      if (config.include.hasOwnProperty(key)) {
        this.replace[key] = config.include[key];
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
