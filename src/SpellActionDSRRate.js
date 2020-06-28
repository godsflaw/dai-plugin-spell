const template = `
        // Set the Dai Savings Rate
        // DSR_RATE is a value determined by the rate accumulator calculation
        // ex. an 8% annual rate will be 1000000002440418608258400030
        //
        uint256 DSR_RATE = _DSR_RATE_;
        PotAbstract(
            _MCD_POT_
        ).file("dsr", DSR_RATE);
`;

export default class SpellActionDSRRate {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.spell_action_dsr_rate) {
      if (_config.spell_action_dsr_rate.hasOwnProperty(key)) {
        this.replace[key] = _config.spell_action_dsr_rate[key];
      }
    }
  }

  build(spell) {
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

    // check that there was a change
    if (result.localeCompare(template) !== 0) {
      result = spell.replace('_SPELL_ACTION_DSR_RATE_', result);
    } else {
      result = spell.replace('_SPELL_ACTION_DSR_RATE_', '');
    }

    return result;
  }
}
