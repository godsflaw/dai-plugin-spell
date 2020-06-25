import { PublicService } from '@makerdao/services-core';

export default class SpellBuilderService extends PublicService {
  constructor(name = 'spellBuilder') {
    super(name, []);
  }

  buildSpell() {
    return 'spell';
  }
}
