import { ApplicationsIFace } from "./dbus.js"
import { MkDirectory, APPICON_CACHE_PATH } from './main.js'
import { Gio, GObject, Gtk } from './lib.js'

export const Apps = GObject.registerClass({
    Signals: { 'sync': {} }
},
class Apps extends GObject.Object{
    constructor(){
        super();

        this._register();
    }

    get json() {
        return this._list;
    }

    _iconPath(icon) {
        return APPICON_CACHE_PATH+icon+'.png';
    }

    init() {
        this._initIcons();
        this.Query('');
    }

    _initIcons() {
        MkDirectory();
        let icons = [];
        Gio.AppInfo.get_all()
            .forEach(app => {
                if(!app.should_show() || !app.get_icon()) return;
                if(typeof app.get_icon().get_names !== 'function') return;
                app?.get_icon()?.get_names()
                    .forEach(icon => icons.push(icon))
            });

        icons.forEach(icon => {
            if(icon.includes('-symbolic')) return;
            let iconInfo = Gtk.IconTheme.get_default()
                .lookup_by_gicon(
                    Gio.Icon.new_for_string(icon), 128, null);

            if(!iconInfo) return;

            let output_stream = 
                Gio.File.new_for_path(this._iconPath(icon))
                .replace(null, false, Gio.FileCreateFlags.NONE, null);
            
            iconInfo.load_icon()
                .save_to_streamv(output_stream, 'png', null, null, null);

            output_stream.close(null);
        })
    }

    _appIconName(app) {
        if (!app.get_icon())
            return '';

        if (typeof app.get_icon().get_names !== 'function')
            return '';
        
        let name = app.get_icon().get_names()[0];
        return name ? this._iconPath(name) : '';
    }

    Query(search) {
        let apps = Gio.AppInfo.get_all();
        let list = [];
        apps.forEach(app => {
            if(!app.should_show()) return;
            if(app.get_name()?.toLowerCase().includes(search)) list.push(app);
            else if(app.get_id()?.toLowerCase().includes(search)) list.push(app);
            else if(app.get_executable()?.toLowerCase().includes(search)) list.push(app);
            else if(app.get_description()?.toLowerCase().includes(search)) list.push(app);
        });

        let outList = [];
        list.forEach(app => {
            outList.push({
                name: app.get_name(),
                desktop: app.get_id(),
                description: app.get_description(),
                icon: this._appIconName(app),
            })
        })
        this._list = outList;
        this.emit('sync');
    }

    _register() {
        Gio.bus_own_name(
            Gio.BusType.SESSION,
            'com.github.aylur.myshell',
            Gio.BusNameOwnerFlags.NONE,
            (connection, _) => {
                this._dbus = Gio.DBusExportedObject.wrapJSObject(ApplicationsIFace, this);
                this._dbus.export(connection, '/com/github/aylur/applications');
            },
            null,
            null,
        );
    }
})
