import { PublicService } from '@makerdao/services-core';

import SpellCopyright from './SpellCopyright';
import SpellSolidityPragma from './SpellSolidityPragma';
import SpellIncludes from './SpellIncludes';
import SpellActionContract from './SpellActionContract';
import SpellActionDSRRate from './SpellActionDSRRate';
import SpellActionLoop from './SpellActionLoop';
import SpellActionCircuitBreakerDisable from './SpellActionCircuitBreakerDisable';
import DssSpellContract from './DssSpellContract';
import DssSpellCircuitBreakerEnable from './DssSpellCircuitBreakerEnable';

export default class SpellBuilderService extends PublicService {
  constructor(name = 'spellBuilder') {
    super(name, []);
  }

  buildCopyright(_config) {
    const spellCopyright = new SpellCopyright(_config);
    return spellCopyright.build();
  }

  buildSolidityPragma(_config) {
    const spellSolidityPragma = new SpellSolidityPragma(_config);
    return spellSolidityPragma.build();
  }

  buildIncludes(_config) {
    const spellIncludes = new SpellIncludes(_config);
    return spellIncludes.build();
  }

  buildHeader(_config) {
    let header;

    header = this.buildCopyright(_config);
    header += this.buildSolidityPragma(_config);
    header += this.buildIncludes(_config);

    return header;
  }

  buildSpellActionContract(_config) {
    const spellActionContract = new SpellActionContract(_config);
    return spellActionContract.build();
  }

  buildSpellActionDSRRate(_config, spell) {
    const spellActionDSRRate = new SpellActionDSRRate(_config);
    return spellActionDSRRate.build(spell);
  }

  buildSpellActionLoop(_config, spell) {
    const spellActionLoop = new SpellActionLoop(_config);
    return spellActionLoop.build(spell);
  }

  buildSpellActionCircuitBreakerDisable(_config, spell) {
    const spellActionCircuitBreakerDisable = new SpellActionCircuitBreakerDisable(
      _config
    );
    return spellActionCircuitBreakerDisable.build(spell);
  }

  buildSpellAction(_config) {
    const spellActionContract = this.buildSpellActionContract(_config);
    const spellActionDSRRate = this.buildSpellActionDSRRate(
      _config,
      spellActionContract
    );
    const spellActionLoop = this.buildSpellActionLoop(
      _config,
      spellActionDSRRate
    );
    const spellActionResult = this.buildSpellActionCircuitBreakerDisable(
      _config,
      spellActionLoop
    );

    return spellActionResult;
  }

  buildDssSpellContract(_config) {
    const dssSpellContract = new DssSpellContract(_config);
    return dssSpellContract.build();
  }

  buildDssSpellCircuitBreakerEnable(_config, spell) {
    const dssSpellCircuitBreakerEnable = new DssSpellCircuitBreakerEnable(
      _config
    );
    return dssSpellCircuitBreakerEnable.build(spell);
  }

  buildDssSpell(_config) {
    const dssSpellContract = this.buildDssSpellContract(_config);
    const buildDssSpellCircuitBreakerEnable = this.buildDssSpellCircuitBreakerEnable(
      _config,
      dssSpellContract
    );
    return buildDssSpellCircuitBreakerEnable;
  }

  buildSpell(_config) {
    let spell;

    spell = this.buildHeader(_config);
    spell += this.buildSpellAction(_config);
    spell += this.buildDssSpell(_config);

    return spell;
  }
}
