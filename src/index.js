import SpellBuilderService from './SpellBuilderService';

export default {
  addConfig: function(config) {
    return {
      ...config,
      additionalServices: ['spellBuilder'],
      spellBuilder: SpellBuilderService
    };
  }
};
