import { PublicService } from '@makerdao/services-core';

import SpellCopyright from './SpellCopyright';
import SpellSolidityPragma from './SpellSolidityPragma';
import SpellIncludes from './SpellIncludes';

export default class SpellBuilderService extends PublicService {
  constructor(name = 'spellBuilder') {
    super(name, []);
  }

  buildSpell() {
    let spell = '';

    // TODO(cmooney): parse config here and only call appropriate build
    // functions.
    spell = this.buildHeader();
    spell += 'body\n';
    spell += this.buildDssSpell();

    return spell;
  }

  buildCopyright() {
    const spellCopyright = new SpellCopyright();
    return spellCopyright.build();
  }

  buildSolidityPragma() {
    const spellSolidityPragma = new SpellSolidityPragma();
    return spellSolidityPragma.build();
  }

  buildIncludes() {
    const spellIncludes = new SpellIncludes();
    return spellIncludes.build();
  }

  buildHeader() {
    let header = '';
    header = this.buildCopyright();
    header += this.buildSolidityPragma();
    header += this.buildIncludes();
    return header;
  }

  buildDssSpell() {
    let DssSpell = 'footer\n';
    return DssSpell;
  }
}
