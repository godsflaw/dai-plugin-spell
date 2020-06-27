const template = `
        bytes32[] memory ilks = IlkRegistryAbstract(_ILK_REGISTRY_).list();

        for (uint i = 0; i < ilks.length; i++) {
            // Always drip the ilk prior to modifications (housekeeping)
            JugAbstract(MCD_JUG).drip(ilks[i]);

            // Set rates by ilk
            //_SPELL_ACTION_ILK_RATES_

            // Set debt ceiling by ilk
            //_SPELL_ACTION_DC_

            // Set tau by ilk
            //_SPELL_ACTION_TAU_

            // Enable/Disable collateral liquidations
            //
            // This change will enable/disable liquidations for collateral types
            // and is colloquially referred to as the "circuit breaker".
            //_SPELL_ACTION_CIRCUIT_BREAKER_

            // Keep a running total of all ilk Debt Ceilings
            (,,, uint256 ilkLine,) = VatAbstract(MCD_VAT).ilks(ilks[i]);
            totalLine += ilkLine;
        }
`;

export default class SpellActionLoop {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.spell_action_loop) {
      if (_config.spell_action_loop.hasOwnProperty(key)) {
        this.replace[key] = _config.spell_action_loop[key];
      }
    }
  }

  build(spell) {
    let result = template;

    for (var key in this.replace) {
      if (this.replace.hasOwnProperty(key)) {
        result = result.replace('_' + key + '_', this.replace[key]);
      }
    }

    // we always want the loop to at least do housecleaning
    result = spell.replace('_SPELL_ACTION_LOOP_', result);

    return result;
  }
}
