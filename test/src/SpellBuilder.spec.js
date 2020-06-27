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
  expect(spellActionDSRRate).toMatch(
    /PotAbstract\(MCD_POT\).file\("dsr", DSR_RATE\)/
  );
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
  const spellActionResult = spellBuilder.buildSpellActionLoop(
    config,
    spellActionDSRRate
  );

  expect(spellAction).toBe(spellActionResult);
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
