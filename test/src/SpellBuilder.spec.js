import Maker from '@makerdao/dai';
import spellPlugin from '../../src';

const infuraProjectId = 'c3f0f26a4c1742e0949d8eedfc47be67';
var config = require('../../example_config.js');

async function makerInstance(preset = 'mainnet') {
  const maker = await Maker.create(preset, {
    plugins: [[spellPlugin]],
    web3: {
      provider: {
        infuraProjectId
      }
    }
  });
  // await maker.authenticate();
  return maker;
}

test('buildCopyright', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');

  const copyright = spellBuilder.buildCopyright(config);
  expect(copyright).toMatch(/Copyright.*2020 MakerDAO[\s\S]*www\.gnu\.org/);
});

test('buildSolidityPragma', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');

  const solidityPragma = spellBuilder.buildSolidityPragma(config);
  expect(solidityPragma).toMatch(/pragma solidity 0\.[0-9]+\.[0-9]+/);
});

test('buildIncludes', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');

  const includes = spellBuilder.buildIncludes(config);
  expect(includes).toMatch(/import "ds-math\/math\.sol";/);
});

test('buildHeader', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const header = spellBuilder.buildHeader(config);

  const copyright = spellBuilder.buildCopyright(config);
  const solidityPragma = spellBuilder.buildSolidityPragma(config);
  const includes = spellBuilder.buildIncludes(config);

  expect(header).toBe(copyright + solidityPragma + includes);
});

test('buildSpellActionContract', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');

  const spellActionContract = spellBuilder.buildSpellActionContract(config);
  expect(spellActionContract).toMatch(/contract SpellAction/);
  expect(spellActionContract).toMatch(/description = "Executive Spell"/);
  expect(spellActionContract).toMatch(/uint256 totalLine = 0/);
  expect(spellActionContract).toMatch(/_SPELL_ACTION_DSR_RATE_/);
  expect(spellActionContract).toMatch(/_SPELL_ACTION_LOOP_/);
  expect(spellActionContract).toMatch(/file\("Line", totalLine\)/);
});

test('buildSpellActionDSRRate no config', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spellActionContract = spellBuilder.buildSpellActionContract(config);

  // remove the config for this template
  const tmp = config.spell_action_dsr_rate;
  delete config.spell_action_dsr_rate;

  const spellActionDSRRate = spellBuilder.buildSpellActionDSRRate(
    config,
    spellActionContract
  );

  config['spell_action_dsr_rate'] = tmp;

  expect(spellActionDSRRate).not.toMatch(/_SPELL_ACTION_DSR_RATE_/);
});

test('buildSpellActionDSRRate', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spellActionContract = spellBuilder.buildSpellActionContract(config);

  const spellActionDSRRate = spellBuilder.buildSpellActionDSRRate(
    config,
    spellActionContract
  );

  expect(spellActionDSRRate).toMatch(/uint256 DSR_RATE/);
  expect(spellActionDSRRate).toMatch(/file\("dsr", DSR_RATE\)/);
});

test('buildSpellActionLoop no config', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spellActionContract = spellBuilder.buildSpellActionContract(config);

  // remove the config for this template
  const tmp = config.spell_action_loop;
  delete config.spell_action_loop;

  const spellActionLoop = spellBuilder.buildSpellActionLoop(
    config,
    spellActionContract
  );

  config['spell_action_loop'] = tmp;

  expect(spellActionLoop).not.toMatch(/_SPELL_ACTION_LOOP_/);
});

test('buildSpellActionLoop', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spellActionContract = spellBuilder.buildSpellActionContract(config);

  const spellActionLoop = spellBuilder.buildSpellActionLoop(
    config,
    spellActionContract
  );

  expect(spellActionLoop).toMatch(/IlkRegistryAbstract registry/);
  expect(spellActionLoop).toMatch(/totalLine \+= ilkLine/);
  expect(spellActionLoop).toMatch(/_SPELL_ACTION_CIRCUIT_BREAKER_DISABLE_/);
});

test('buildSpellActionCircuitBreakerDisable no config', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spellActionContract = spellBuilder.buildSpellActionContract(config);
  const spellActionLoop = spellBuilder.buildSpellActionLoop(
    config,
    spellActionContract
  );

  // remove the config for this template
  const tmp = config.spell_action_circuit_breaker_disable;
  delete config.spell_action_circuit_breaker_disable;

  const spellActionCircuitBreakerDisable = spellBuilder.buildSpellActionCircuitBreakerDisable(
    config,
    spellActionLoop
  );

  config['spell_action_circuit_breaker_disable'] = tmp;

  expect(spellActionCircuitBreakerDisable).not.toMatch(
    /_SPELL_ACTION_CIRCUIT_BREAKER_DISABLE_/
  );
});

test('buildSpellActionCircuitBreakerDisable', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spellActionContract = spellBuilder.buildSpellActionContract(config);
  const spellActionLoop = spellBuilder.buildSpellActionLoop(
    config,
    spellActionContract
  );

  const spellActionCircuitBreakerDisable = spellBuilder.buildSpellActionCircuitBreakerDisable(
    config,
    spellActionLoop
  );

  expect(spellActionCircuitBreakerDisable).toMatch(
    /Enable all collateral liquidations/
  );
  expect(spellActionCircuitBreakerDisable).toMatch(/rely\(registry\.flip/);
});

test('buildSpellAction', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spellAction = spellBuilder.buildSpellAction(config);

  const spellActionContract = spellBuilder.buildSpellActionContract(config);
  const spellActionDSRRate = spellBuilder.buildSpellActionDSRRate(
    config,
    spellActionContract
  );
  const spellActionLoop = spellBuilder.buildSpellActionLoop(
    config,
    spellActionDSRRate
  );
  const spellActionResult = spellBuilder.buildSpellActionCircuitBreakerDisable(
    config,
    spellActionLoop
  );

  expect(spellAction).toBe(spellActionResult);
});

test('buildDssSpellContract', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');

  const dssSpellContract = spellBuilder.buildDssSpellContract(config);
  expect(dssSpellContract).toMatch(/contract DssSpell/);
  expect(dssSpellContract).toMatch(/function description/);
  expect(dssSpellContract).toMatch(/function schedule/);
  expect(dssSpellContract).toMatch(/function cast/);
  expect(dssSpellContract).toMatch(/_DSS_SPELL_CIRCUIT_BREAKER_ENABLE_/);
});

test('buildDssSpellCircuitBreakerEnable no config', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const dssSpellContract = spellBuilder.buildDssSpellContract(config);

  // remove the config for this template
  const tmp = config.dss_spell_circuit_breaker_enable;
  delete config.dss_spell_circuit_breaker_enable;

  const dssSpellCircuitBreakerEnable = spellBuilder.buildDssSpellCircuitBreakerEnable(
    config,
    dssSpellContract
  );

  config['dss_spell_circuit_breaker_enable'] = tmp;

  expect(dssSpellCircuitBreakerEnable).not.toMatch(
    /_DSS_SPELL_CIRCUIT_BREAKER_ENABLE_/
  );
});

test('buildDssSpellCircuitBreakerEnable', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const dssSpellContract = spellBuilder.buildDssSpellContract(config);

  const dssSpellCircuitBreakerEnable = spellBuilder.buildDssSpellCircuitBreakerEnable(
    config,
    dssSpellContract
  );

  expect(dssSpellCircuitBreakerEnable).toMatch(
    /Disable all collateral liquidations/
  );
  expect(dssSpellCircuitBreakerEnable).toMatch(/deny\(registry\.flip/);
});

test('buildDssSpell', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const dssSpell = spellBuilder.buildDssSpell(config);

  const dssSpellContract = spellBuilder.buildDssSpellContract(config);
  const buildDssSpellCircuitBreakerEnable = spellBuilder.buildDssSpellCircuitBreakerEnable(
    config,
    dssSpellContract
  );

  expect(dssSpell).toBe(buildDssSpellCircuitBreakerEnable);
});

test('buildSpell', async () => {
  const maker = await makerInstance();
  const spellBuilder = maker.service('spellBuilder');
  const spell = maker.service('spellBuilder').buildSpell(config);

  const header = spellBuilder.buildHeader(config);
  const SpellAction = spellBuilder.buildSpellAction(config);
  const DssSpell = spellBuilder.buildDssSpell(config);

  console.log('\x1b[36m%s\x1b[0m', spell);

  expect(spell).toBe(header + SpellAction + DssSpell);
});
