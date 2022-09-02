'use strict';

const { St } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const QuickToggles = Me.imports.quickToggle;
const SystemLevels = Me.imports.systemLevels;
const PowerMenu = Me.imports.powerMenu;
const MediaControl = Me.imports.mediaControl;
const MessageIndicator = Me.imports.messageIndicator;
const WorkspacesBar = Me.imports.workspacesBar;
const BatteryBar = Me.imports.batteryBar;
const ThemeSwitcher = Me.imports.themeSwitcher;
const DashBoard = Me.imports.dashBoard;

const Main = imports.ui.main;
const AppMenu = Main.panel.statusArea.appMenu;
const DateMenu = Main.panel.statusArea.dateMenu;
const Activities = Main.panel.statusArea.activities;

function enable(){
    QuickToggles.enable();
    SystemLevels.enable();
    PowerMenu.enable();
    MediaControl.enable();
    MessageIndicator.enable();
    WorkspacesBar.enable(0);
    DashBoard.enable();
    BatteryBar.enable();
    ThemeSwitcher.enable();

    // set_panel_position(8, 46)
    Activities.hide();
}

function disable(){
    QuickToggles.disable();
    SystemLevels.disable();
    PowerMenu.disable();
    MediaControl.disable();
    MessageIndicator.disable();
    WorkspacesBar.disable();
    DashBoard.disable();
    BatteryBar.disable();
    ThemeSwitcher.disable();

    // reset_panel_position();
    Activities.show();
}



const PanelBox = Main.layoutManager.panelBox;

function set_panel_position(padding, panelHeight) {
    let monitor = Main.layoutManager.primaryMonitor;
    Main.panel.height = panelHeight;
    Main.panel.style = 'margin: 0 '+padding+'px'+'0'+padding+'px';
    PanelBox.set_position(monitor.x, (monitor.x + monitor.height - PanelBox.height - ( panelHeight + padding)));
}

function reset_panel_position() {
    let monitor = Main.layoutManager.primaryMonitor;
    PanelBox.set_position(monitor.x, monitor.y);
}