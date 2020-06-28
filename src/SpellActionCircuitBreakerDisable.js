const template = `
            // Enable all collateral liquidations
            //
            // This change will enable liquidations for collateral types
            // and is colloquially referred to as the "circuit breaker".
            //
            FlipperMomAbstract(
                _FLIPPER_MOM_
            ).rely(registry.flip(ilks[i]));
`;

export default class SpellActionCircuitBreakerDisable {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.spell_action_circuit_breaker_disable) {
      if (_config.spell_action_circuit_breaker_disable.hasOwnProperty(key)) {
        this.replace[key] = _config.spell_action_circuit_breaker_disable[key];
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
      result = spell.replace('_SPELL_ACTION_CIRCUIT_BREAKER_DISABLE_', result);
    } else {
      result = spell.replace('_SPELL_ACTION_CIRCUIT_BREAKER_DISABLE_', '');
    }

    return result;
  }
}
