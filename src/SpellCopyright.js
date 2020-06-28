const template = `
// Copyright (C) 2020 _ORGANIZATION_
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
`;

export default class SpellCopyright {
  constructor(_config) {
    this.replace = {};

    for (let key in _config.general) {
      if (_config.general.hasOwnProperty(key)) {
        this.replace[key] = _config.general[key];
      }
    }

    for (let key in _config.copyright) {
      if (_config.copyright.hasOwnProperty(key)) {
        this.replace[key] = _config.copyright[key];
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
