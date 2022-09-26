// this is a fork of this
// https://github.com/fthx/workspaces-bar
'use strict';

const { Clutter, Gio, GObject, Shell, St } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

var WorkspacesBar = GObject.registerClass(
class WorkspacesBar extends PanelMenu.Button {
	_init(settings) {
		super._init(0.0, 'Workspaces Indicator', true);

        this.settings = settings;

        this.add_style_class_name('workspace-indicator')
        this.ws_bar = new St.BoxLayout();
        this.add_child(this.ws_bar);
        
		this._ws_active_changed = global.workspace_manager.connect('active-workspace-changed', this._update_ws.bind(this));
		this._ws_number_changed = global.workspace_manager.connect('notify::n-workspaces', this._update_ws.bind(this));
		this._restacked = global.display.connect('restacked', this._update_ws.bind(this));
		this._windows_changed = Shell.WindowTracker.get_default().connect('tracked-windows-changed', this._update_ws.bind(this));

        this.workspaces_settings = new Gio.Settings({ schema: 'org.gnome.desktop.wm.preferences' });
		this.workspaces_names_changed = this.workspaces_settings.connect('changed::workspace-names', this._update_ws.bind(this));
	

        this.connect('destroy', () => {
            global.workspace_manager.disconnect(this._ws_active_changed);
            global.workspace_manager.disconnect(this._ws_number_changed);
            global.display.disconnect(this._restacked);
            Shell.WindowTracker.get_default().disconnect(this._windows_changed);
			this.workspaces_settings.disconnect(this.workspaces_names_changed);
            this.ws_bar.destroy();
        });


        this._update_ws();
	}

    _update_ws() {
    	this.ws_bar.destroy_all_children();
    	
        const ws_count = global.workspace_manager.get_n_workspaces();
        const active_ws_index = global.workspace_manager.get_active_workspace_index();

		const workspaces_names = this.workspaces_settings.get_strv('workspace-names');
		
        for (let ws_index = 0; ws_index < ws_count; ++ws_index) {
			let ws_box = new St.Button({ can_focus: true });
            if(this.settings.get_boolean('workspace-indicator-show-names')){
                let label = new St.Label({ y_align: Clutter.ActorAlign.CENTER });
                if (workspaces_names[ws_index])
                    label.text = workspaces_names[ws_index];
                else
                    label.text = `${ ws_index + 1 }`;

                if(ws_index == active_ws_index)
                    label.style_class = 'workspace-indicator-active';
                else
                    label.style_class = 'workspace-indicator-inactive';

                ws_box.set_child(label);
            }else{
                let icon = new St.Icon({ y_align: Clutter.ActorAlign.CENTER, style_class: 'system-status-icon' });
                if (ws_index == active_ws_index)
                    icon.gicon = Gio.icon_new_for_string(Me.dir.get_path()+'/media/circle-filled-symbolic.svg');
                else
                    icon.gicon = Gio.icon_new_for_string(Me.dir.get_path()+'/media/circle-symbolic.svg');
                ws_box.set_child(icon);
            }

			ws_box.connect('button-release-event', () => this._toggle_ws(ws_index) );
	        this.ws_bar.add_child(ws_box);
		}
    }

    _toggle_ws(ws_index) {
		if (global.workspace_manager.get_active_workspace_index() == ws_index) {
			Main.overview.toggle();
		} else {
			global.workspace_manager.get_workspace_by_index(ws_index).activate(global.get_current_time());
		}
    }
});

var Extension = class Extension {
    constructor() {
        this.pos = [
            'left',
            'center',
            'right',
        ]
    }

    enable() {
        this.settings = ExtensionUtils.getSettings();
        this.settings.connect('changed::workspace-indicator-offset', () => this.reload());
        this.settings.connect('changed::workspace-indicator-position', () => this.reload());
        this.settings.connect('changed::workspace-indicator-show-names', () => this.reload());
        this.reload();
    }

    disable() {
    	this.panelButton.destroy();
		this.panelButton = null;
        this.settings = null;
    }

    reload(){
        if(this.panelButton){
            this.panelButton.destroy();
            this.panelButton = null;
        }
        this.panelButton = new WorkspacesBar(this.settings);

        let pos = this.settings.get_int('workspace-indicator-position');
        let offset = this.settings.get_int('workspace-indicator-offset');

        Main.panel.addToStatusArea('Workspaces Indicator', this.panelButton, offset, this.pos[pos]);
    }
}