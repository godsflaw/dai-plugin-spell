import Maker from '@makerdao/dai';
import spellPlugin from '../../src';

const infuraProjectId = 'c3f0f26a4c1742e0949d8eedfc47be67';

async function makerInstance(preset = 'mainnet') {
  const maker = await Maker.create(preset, {
    plugins: [[spellPlugin]],
    web3: {
      provider: {
        infuraProjectId
      }
    }
  });
  await maker.authenticate();
  return maker;
}

test('buildSpell', async () => {
  const maker = await makerInstance();
  const spell = maker.service('spellBuilder').buildSpell();
  expect(spell).toBe('spell');
});
