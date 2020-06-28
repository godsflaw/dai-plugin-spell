const template = `
contract DssSpell {

    DSPauseAbstract  public pause;
    address          public action;
    bytes32          public tag;
    uint256          public eta;
    bytes            public sig;
    uint256          public expiration;
    bool             public done;

    constructor() public {
        sig = abi.encodeWithSignature("execute()");
        action = address(new SpellAction());
        bytes32 _tag;
        address _action = action;
        assembly { _tag := extcodehash(_action) }
        tag = _tag;
        pause = DSPauseAbstract(
            _MCD_PAUSE_
        );
    }

    function description() public view returns (string memory) {
        return SpellAction(action).description();
    }

    function schedule() public {
        require(eta == 0, "This spell has already been scheduled");
        eta = now + pause.delay();
        pause.plot(action, tag, sig, eta);
        _DSS_SPELL_CIRCUIT_BREAKER_ENABLE_
    }

    function cast() public {
        require(!done, "spell-already-cast");
        done = true;
        pause.exec(action, tag, sig, eta);
    }
}
`;

export default class DssSpellContract {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.dss_spell_contract) {
      if (_config.dss_spell_contract.hasOwnProperty(key)) {
        this.replace[key] = _config.dss_spell_contract[key];
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
