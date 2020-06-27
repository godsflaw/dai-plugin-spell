const template = `
contract SpellAction {
    // Provides a descriptive tag for bot consumption
    // This should be modified weekly to provide a summary of the actions
    //
    string constant public description = "_SPELL_DESCRIPTION_";

    // The contracts in this list should correspond to MCD core contracts, verify
    //  against the current release list at:
    //     https://changelog.makerdao.com/
    //
    address constant public DEPLOYER = _DEPLOYER_;
    address constant public MULTICALL = _MULTICALL_;
    address constant public FAUCET = _FAUCET_;
    address constant public MCD_DEPLOY = _MCD_DEPLOY_;
    address constant public MCD_GOV = _MCD_GOV_;
    address constant public GOV_GUARD = _GOV_GUARD_;
    address constant public MCD_ADM = _MCD_ADM_;
    address constant public MCD_VAT = _MCD_VAT_;
    address constant public MCD_JUG = _MCD_JUG_;
    address constant public MCD_CAT = _MCD_CAT_;
    address constant public MCD_VOW = _MCD_VOW_;
    address constant public MCD_JOIN_DAI = _MCD_JOIN_DAI_;
    address constant public MCD_FLAP = _MCD_FLAP_;
    address constant public MCD_FLOP = _MCD_FLOP_;
    address constant public MCD_PAUSE = _MCD_PAUSE_;
    address constant public MCD_PAUSE_PROXY = _MCD_PAUSE_PROXY_;
    address constant public MCD_GOV_ACTIONS = _MCD_GOV_ACTIONS_;
    address constant public MCD_DAI = _MCD_DAI_;
    address constant public MCD_SPOT = _MCD_SPOT_;
    address constant public MCD_POT = _MCD_POT_;
    address constant public MCD_END = _MCD_END_;
    address constant public MCD_ESM = _MCD_ESM_;
    address constant public PROXY_ACTIONS = _PROXY_ACTIONS_;
    address constant public PROXY_ACTIONS_END = _PROXY_ACTIONS_END_;
    address constant public PROXY_ACTIONS_DSR = _PROXY_ACTIONS_DSR_;
    address constant public CDP_MANAGER = _CDP_MANAGER_;
    address constant public DSR_MANAGER = _DSR_MANAGER_;
    address constant public GET_CDPS = _GET_CDPS_;
    address constant public OSM_MOM = _OSM_MOM_;
    address constant public FLIPPER_MOM = _FLIPPER_MOM_;
    address constant public PROXY_FACTORY = _PROXY_FACTORY_;
    address constant public PROXY_REGISTRY = _PROXY_REGISTRY_;
    address constant public ETH = _ETH_;
    address constant public PIP_ETH = _PIP_ETH_;
    address constant public MCD_JOIN_ETH_A = _MCD_JOIN_ETH_A_;
    address constant public MCD_FLIP_ETH_A = _MCD_FLIP_ETH_A_;
    address constant public BAT = _BAT_;
    address constant public PIP_BAT = _PIP_BAT_;
    address constant public MCD_JOIN_BAT_A = _MCD_JOIN_BAT_A_;
    address constant public MCD_FLIP_BAT_A = _MCD_FLIP_BAT_A_;
    address constant public USDC = _USDC_;
    address constant public PIP_USDC = _PIP_USDC_;
    address constant public MCD_JOIN_USDC_A = _MCD_JOIN_USDC_A_;
    address constant public MCD_FLIP_USDC_A = _MCD_FLIP_USDC_A_;
    address constant public MCD_JOIN_USDC_B = _MCD_JOIN_USDC_B_;
    address constant public MCD_FLIP_USDC_B = _MCD_FLIP_USDC_B_;
    address constant public WBTC = _WBTC_;
    address constant public PIP_WBTC = _PIP_WBTC_;
    address constant public MCD_JOIN_WBTC_A = _MCD_JOIN_WBTC_A_;
    address constant public MCD_FLIP_WBTC_A = _MCD_FLIP_WBTC_A_;
    address constant public TUSD = _TUSD_;
    address constant public PIP_TUSD = _PIP_TUSD_;
    address constant public MCD_JOIN_TUSD_A = _MCD_JOIN_TUSD_A_;
    address constant public MCD_FLIP_TUSD_A = _MCD_FLIP_TUSD_A_;
    address constant public ZRX = _ZRX_;
    address constant public PIP_ZRX = _PIP_ZRX_;
    address constant public MCD_FLIP_ZRX_A = _MCD_FLIP_ZRX_A_;
    address constant public MCD_JOIN_ZRX_A = _MCD_JOIN_ZRX_A_;
    address constant public KNC = _KNC_;
    address constant public PIP_KNC = _PIP_KNC_;
    address constant public MCD_FLIP_KNC_A = _MCD_FLIP_KNC_A_;
    address constant public MCD_JOIN_KNC_A = _MCD_JOIN_KNC_A_;
    address constant public PROXY_PAUSE_ACTIONS = _PROXY_PAUSE_ACTIONS_;
    address constant public PROXY_DEPLOYER = _PROXY_DEPLOYER_;

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
        PotAbstract(MCD_POT).drip();

        _SPELL_ACTION_DSR_RATE_

        _SPELL_ACTION_LOOP_

        // Set the Global Debt Ceiling to the sum of all ilk line
        //
        VatAbstract(MCD_VAT).file("Line", totalLine);
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
    let result = template;

    for (var key in this.replace) {
      if (this.replace.hasOwnProperty(key)) {
        result = result.replace('_' + key + '_', this.replace[key]);
      }
    }

    return result;
  }
}
