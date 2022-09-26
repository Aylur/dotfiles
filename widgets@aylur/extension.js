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
'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension()
const BatteryBar = Me.imports.batteryBar;
const DashBoard = Me.imports.dashBoard;
const DateMenuMod = Me.imports.dateMenuMod;
const MediaPlayer = Me.imports.mediaPlayer;
const PowerMenu = Me.imports.powerMenu;
const WorkspaceIndicator = Me.imports.workspaceIndicator;
const QuickToggles = Me.imports.quickToggles;

class Extension {
    constructor() {}
    enable() {
        this.settings = ExtensionUtils.getSettings();

        this.batteryBar = new BatteryBar.Extension();
        this.dashBoard = new DashBoard.Extension();
        this.dateMenuMod = new DateMenuMod.Extension();
        this.mediaPlayer = new MediaPlayer.Extension();
        this.powerMenu = new PowerMenu.Extension();
        this.workspaceIndicator = new WorkspaceIndicator.Extension();
        this.quickToggles = new QuickToggles.Extension();

        if(this.settings.get_boolean('battery-bar')) this.toggleExtension(this.batteryBar);
        if(this.settings.get_boolean('dash-board')) this.toggleExtension(this.dashBoard);
        if(this.settings.get_boolean('date-menu-mod')) this.toggleExtension(this.dateMenuMod);
        if(this.settings.get_boolean('media-player')) this.toggleExtension(this.mediaPlayer);
        if(this.settings.get_boolean('power-menu')) this.toggleExtension(this.powerMenu);
        if(this.settings.get_boolean('workspace-indicator')) this.toggleExtension(this.workspaceIndicator);
        if(this.settings.get_boolean('quick-toggles')) this.toggleExtension(this.quickToggles);
        
        this.settings.connect('changed::battery-bar', () => this.toggleExtension(this.batteryBar));
        this.settings.connect('changed::dash-board', () => this.toggleExtension(this.dashBoard));
        this.settings.connect('changed::date-menu-mod', () => this.toggleExtension(this.dateMenuMod));
        this.settings.connect('changed::media-player', () => this.toggleExtension(this.mediaPlayer));
        this.settings.connect('changed::power-menu', () => this.toggleExtension(this.powerMenu));
        this.settings.connect('changed::workspace-indicator', () => this.toggleExtension(this.workspaceIndicator));
        this.settings.connect('changed::quick-toggles', () => this.toggleExtension(this.quickToggles));
    }

    disable() {
        if(this.batteryBar.enabled) this.batteryBar.disable();
        if(this.dashBoard.enabled) this.dashBoard.disable();
        if(this.dateMenuMod.enabled) this.dateMenuMod.disable();
        if(this.mediaPlayer.enabled) this.mediaPlayer.disable();
        if(this.powerMenu.enabled) this.powerMenu.disable();
        if(this.workspaceIndicator.enabled) this.workspaceIndicator.disable();
        if(this.quickToggles.enabled) this.quickToggles.disable();

        this.batteryBar = null;
        this.dashBoard = null;
        this.dateMenuMod = null;
        this.mediaPlayer = null;
        this.powerMenu = null;
        this.workspaceIndicator = null;
        this.quickToggles = null;
    }

    toggleExtension(extension){
        if(!extension.enabled){
            extension.enable();
            extension.enabled = true;
        }else{
            extension.disable();
            extension.enabled = false;
        }
    }
}

function init() {
    return new Extension();
}
