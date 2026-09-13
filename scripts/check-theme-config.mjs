import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const schema = await read('config/settings_schema.json');
const data = await read('config/settings_data.json');
assert.ok(schema.length > 1, 'Shopify global settings schema must not be empty');
assert.equal(schema[0].name, 'theme_info');
const settings = schema.flatMap(group => group.settings ?? []);
const ids = settings.filter(setting => setting.id).map(setting => setting.id);
assert.equal(ids.length, new Set(ids).size, 'Setting IDs must be unique');
for (const id of ['body_scale', 'heading_scale', 'type_body_font', 'type_header_font', 'color_schemes', 'inputs_radius', 'bxr_support_page']) {
  assert.ok(ids.includes(id), `Required setting missing: ${id}`);
}
for (const setting of settings) {
  if (setting.type === 'link_list' && 'default' in setting) {
    assert.ok(['main-menu', 'footer'].includes(setting.default), `Unsupported menu default: ${setting.id}`);
  }
  if (setting.type === 'range') {
    for (const value of [setting.default, data.current[setting.id]].filter(value => value !== undefined)) {
      assert.ok(value >= setting.min && value <= setting.max, `${setting.id} outside range`);
      const steps = (value - setting.min) / (setting.step ?? 1);
      assert.ok(Math.abs(steps - Math.round(steps)) < 1e-8, `${setting.id} does not match step`);
    }
  }
}
console.log(`Global configuration validated: ${ids.length} settings, supported menu defaults and valid numeric ranges.`);
