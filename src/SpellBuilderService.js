import { PublicService } from '@makerdao/services-core';

import SpellCopyright from './SpellCopyright';
import SpellSolidityPragma from './SpellSolidityPragma';
import SpellIncludes from './SpellIncludes';

export default class SpellBuilderService extends PublicService {
  constructor(name = 'spellBuilder') {
    super(name, []);
  }

  buildSpell(_config) {
    let spell = '';

    spell = this.buildHeader(_config);
    spell += this.buildSpellAction(_config);
    spell += this.buildDssSpell(_config);

    return spell;
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
    let header = '';
    header = this.buildCopyright(_config);
    header += this.buildSolidityPragma(_config);
    header += this.buildIncludes(_config);
    return header;
  }

  buildSpellAction(_config) {
    let SpellAction = 'SpellAction\n';

    if (_config.flags.hasDC) {
      // call buildSpellLine()
    }

    return SpellAction;
  }

  buildDssSpell(_config) {
    let DssSpell = 'DssSpell\n';
    return DssSpell;
  }
}
