import { NotificationIFace } from "./dbus.js"
import { NOTIFICATIONS_CACHE_PATH, NOTIFICATIONS_BANNER_TIME_OUT, MkDirectory, CACHE_PATH } from './main.js'
import { GObject, Gio, Gtk, GdkPixbuf, GLib } from './lib.js'

export const Notifications = GObject.registerClass({
    Signals: { 'sync': {} }
},
class Notifications extends GObject.Object{
    constructor(fg_color = 'white') {
        super();

        this._fgColor = fg_color;
        this._json = {};
        this._dnd = false;
        this._idCound = 1;
        this._notifications = new Map();
        this._popups = new Map();
        this._readFromFile();
        this._register();
        this._sync();
    }

    get json() { return this._json }

    get DoNotDisturb() {
        return this._dnd;
    }

    Clear() {
        for (const [_, notification] of this._notifications) {
            this.CloseNotification(notification.id);
        } 
    }

    Notify(app_name, replaces_id, app_icon, summary, body, actions, hints, time_out) {
        let acts = [];
        for(let i=0; i<actions.length; i+=2) {
            if(actions[i+1] !== '')
                acts.push({
                    label: actions[i+1],
                    id: actions[i]
                })
        }
        let id = replaces_id || this._idCound++;
        let date = new Date();
        let notification = {
            id,
            app_name,
            app_icon,
            summary,
            body,
            actions: acts,
            time: { hour: date.getHours(), minute: date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}` },
            image:  
                this._parseImage(hints['image-data'], `${summary}${id}`) || 
                this._parseIcon(app_icon, `${summary}${id}`) || 
                this._parseIcon(app_name, `${summary}${id}`)
        }
        this._notifications.set(notification.id, notification);
        if(!this._dnd) {
            this._popups.set(notification.id, notification);
            GLib.timeout_add(GLib.PRIORITY_DEFAULT,
                time_out > 0 ? time_out : NOTIFICATIONS_BANNER_TIME_OUT,
                () => {
                    if(!this._popups.has(id)) return;
                    this._popups.delete(notification.id);
                    this._sync();
                }
            );
        }
        this._sync();
        return notification.id;
    }

    ToggleDND() {
        this._dnd = !this._dnd;
        this._sync();
    }

    DismissNotification(id) {
        this._popups.delete(id);
        this._sync();
    }

    CloseNotification(id) {
        if(!this._notifications.has(id)) return;
        this._dbus.emit_signal('NotificationClosed', GLib.Variant.new('(uu)', [id, 2]));
        this._notifications.delete(id);
        this._popups.delete(id);
        this._sync();
    }

    InvokeAction(id, action) {
        if(!this._notifications.has(id)) return;
        this._dbus.emit_signal('ActionInvoked', GLib.Variant.new('(us)', [id, action]));
        this._notifications.delete(id);
        this._popups.delete(id);
        this._sync();
    }

    GetCapabilities() {
        return ['actions', 'body', 'icon-static', 'persistence'];
    }

    GetServerInformation() {
        return new GLib.Variant('(ssss)', [
            "myshell",
            "Aylur",
            "0.1",
            "1.2",
        ])
    }

    _register() {
        Gio.bus_own_name(
            Gio.BusType.SESSION,
            'org.freedesktop.Notifications',
            Gio.BusNameOwnerFlags.NONE,
            (connection, _) => {
                this._dbus = Gio.DBusExportedObject.wrapJSObject(NotificationIFace, this);
                this._dbus.export(connection, '/org/freedesktop/Notifications');
            },
            null,
            () => { 
                print('Another Notification Daemon is already running!')
            }
        );
    }
    
    _filterName(name) {
        return NOTIFICATIONS_CACHE_PATH+name.replace(/[\ \,\*\?\"\<\>\|\#\:\?\/\!\']/g, '')+'.png';
    }

    _parseIcon(icon_name, name) {
        if(!icon_name) return;

        MkDirectory();
        let fileName = this._filterName(name);
        let iconInfo = Gtk.IconTheme.get_default()
            .lookup_by_gicon(
                Gio.Icon.new_for_string(icon_name),
                128, null);

        if(!iconInfo) return null;

        let output_stream = 
            Gio.File.new_for_path(fileName)
            .replace(null, false, Gio.FileCreateFlags.NONE, null);

        iconInfo.load_icon()
            .save_to_streamv(output_stream, 'png', null, null, null);

        output_stream.close(null);

        if(icon_name.includes('-symbolic'))
            GLib.spawn_command_line_sync(`convert ${fileName} -alpha on
                -fill ${this._fgColor} -colorize 100% -bordercolor transparent -border 16 ${fileName}`);
        
        return fileName;
    }

    _readFromFile() {
        try {
            const file = Gio.File.new_for_path(CACHE_PATH+'notifications.json');
            const [, contents, etag] = file.load_contents(null);
            const json = JSON.parse(new TextDecoder('utf-8').decode(contents))
            json.notifications.forEach(n => {
                if(n.id > this._idCound) this._idCound = n.id+1;
                this._notifications.set(n.id, n);
            })
        } catch (error) {
            print('There were no cached notifications found!')
            print('If you want your notifications to be cached run with --file flag');
        }
    }

    _parseImage(image_data, name) {
        if(!image_data) return;
        MkDirectory();
        let fileName = this._filterName(name);
        let image = image_data.recursiveUnpack();
        let pixbuf = GdkPixbuf.Pixbuf.new_from_bytes(
            image[6],
            GdkPixbuf.Colorspace.RGB,
            image[3],
            image[4],
            image[0],
            image[1],
            image[2]
        ); 

        let output_stream = 
            Gio.File.new_for_path(fileName)
            .replace(null, false, Gio.FileCreateFlags.NONE, null);

        pixbuf.save_to_streamv(output_stream, "png", null, null, null);
        output_stream.close(null);
        
        return fileName;
    }

    _sync() {
        let notifications = [], popups = [];
        for (const [_, notification] of this._notifications)
            notifications.push(notification);

        for (const [_, notification] of this._popups)
            popups.push(notification);

        this._json = {
            dnd: {
                enabled: this._dnd,
                state: this._dnd ? 'on' : 'off',
                icon: this._dnd ? '󰂛' : '󰂚',
            },
            count: notifications.length,
            icon: this._dnd ? '󰂛' : (notifications.length > 0 ? '󱅫' : '󰂚'),
            notifications,
            popups
        }
        this.emit('sync');
    }
})
