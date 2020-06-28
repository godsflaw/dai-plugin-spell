const template = `
contract SpellAction {
    // Provides a descriptive tag for bot consumption
    // This should be modified weekly to provide a summary of the actions
    //
    string constant public description = "_SPELL_DESCRIPTION_";

    // Common orders of magnitude needed in spells
    //
    uint256 constant public WAD      = 10**18;
    uint256 constant public RAY      = 10**27;
    uint256 constant public RAD      = 10**45;
    uint256 constant public HUNDRED  = 10**2;
    uint256 constant public THOUSAND = 10**3;
    uint256 constant public MILLION  = 10**6;
    uint256 constant public BILLION  = 10**9;

    function execute() external {
        uint256 totalLine = 0;

        // Many of the settings that change weekly rely on the rate accumulator
        // described at:
        //    https://docs.makerdao.com/smart-contract-modules/rates-module
        // To check yourself, use the following rate calculation (example 8%):
        //    $ bc -l <<< 'scale=27; e( l(1.08)/(60 * 60 * 24 * 365) )'
        //    EIGHT_PCT_RATE = 1000000002440418608258400030
        //

        // Ensure we drip pot prior to modifications (housekeeping).
        //
        PotAbstract(
            _MCD_POT_
        ).drip();

        _SPELL_ACTION_DSR_RATE_

        _SPELL_ACTION_LOOP_

        // Set the Global Debt Ceiling to the sum of all ilk line
        //
        VatAbstract(
            _MCD_VAT_
        ).file("Line", totalLine);
    }
}
`;

export default class SpellActionContract {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.spell_action_contract) {
      if (_config.spell_action_contract.hasOwnProperty(key)) {
        this.replace[key] = _config.spell_action_contract[key];
      }
    }
  }

  build() {
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

    return result;
  }
}
