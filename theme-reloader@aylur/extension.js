/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
const { GObject, St, Shell, Meta } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Reload Theme');

        let box = new St.BoxLayout();
        box.add_child(new St.Icon({
            icon_name: 'applications-graphics-symbolic',
            style_class: 'system-status-icon',
            style: 'margin-right: 0;',
        }));
        box.add_child(new St.Icon({
            icon_name: 'view-refresh-symbolic',
            style_class: 'system-status-icon',
            style: 'margin-left: 0;',
        }));
        this.add_child(box);

        this.connect('button-press-event', () => Main.loadTheme());

        let settings = ExtensionUtils.getSettings();
        Main.wm.addKeybinding('shortcut', settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.ALL,
            () => Main.loadTheme());

        this.connect('destroy', () => Main.wm.removeKeybinding('dash-shortcut'));
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
