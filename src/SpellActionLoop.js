const template = `
        IlkRegistryAbstract registry = IlkRegistryAbstract(
            _ILK_REGISTRY_
        );
        bytes32[] memory ilks = registry.list();

        for (uint i = 0; i < ilks.length; i++) {
            // Always drip the ilk prior to modifications (housekeeping)
            JugAbstract(
                _MCD_JUG_
            ).drip(ilks[i]);

            _SPELL_ACTION_CIRCUIT_BREAKER_DISABLE_

            // Keep a running total of all ilk Debt Ceilings
            (,,, uint256 ilkLine,) = VatAbstract(
                _MCD_VAT_
            ).ilks(ilks[i]);
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

    // we always want the loop to at least do housecleaning
    result = spell.replace('_SPELL_ACTION_LOOP_', result);

    return result;
  }
}
