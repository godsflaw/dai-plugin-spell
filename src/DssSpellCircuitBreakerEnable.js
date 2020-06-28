const template = `
        // Disable all collateral liquidations
        //
        // This change will prevent liquidations across all collateral types
        // and is colloquially referred to as the circuit breaker.
        //
        IlkRegistryAbstract registry = IlkRegistryAbstract(
            _ILK_REGISTRY_
        );
        bytes32[] memory ilks = registry.list();

        for (uint i = 0; i < ilks.length; i++) {
            FlipperMomAbstract(
                _FLIPPER_MOM_
            ).deny(registry.flip(ilks[i]));
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

    // check that there was a change
    if (result.localeCompare(template) !== 0) {
      result = spell.replace('_DSS_SPELL_CIRCUIT_BREAKER_ENABLE_', result);
    } else {
      result = spell.replace('_DSS_SPELL_CIRCUIT_BREAKER_ENABLE_', '');
    }

    return result;
  }
}
