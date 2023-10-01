import { Service, Utils, App } from '../imports.js';
import GLib from 'gi://GLib';
const now = () => GLib.DateTime.new_now_local().format('%Y-%m-%d_%H-%M-%S');

class Recorder extends Service {
    static {
        Service.register(this, {}, {
            'timer': ['int'],
            'recording': ['boolean'],
        });
    }

    _path = GLib.get_home_dir() + '/Videos/Screencasting';
    _screenshotting = false;
    recording = false;
    timer = 0;

    start() {
        if (this.recording)
            return;

        Utils.execAsync('slurp')
            .then(area => {
                Utils.ensureDirectory(this._path);
                this._file = `${this._path}/${now()}.mp4`;
                Utils.execAsync(['wf-recorder', '-g', area, '-f', this._file]);
                this.recording = true;
                this.changed('recording');

                this.timer = 0;
                this._interval = Utils.interval(1000, () => {
                    this.changed('timer');
                    this.timer++;
                });
            })
            .catch(print);
    }

    stop() {
        if (!this.recording)
            return;

        Utils.execAsync('killall -INT wf-recorder').catch(print);
        this.recording = false;
        this.changed('recording');
        GLib.source_remove(this._interval);
        Utils.execAsync([
            'notify-send',
            '-A', 'files=Show in Files',
            '-A', 'view=View',
            '-i', 'video-x-generic-symbolic',
            'Screenrecord',
            this._file,
        ])
            .then(res => {
                if (res === 'files')
                    Utils.execAsync('xdg-open ' + this._path);

                if (res === 'view')
                    Utils.execAsync('xdg-open ' + this._file);
            })
            .catch(print);
    }

    async screenshot(full = false) {
        try {
            const area = full ? null : await Utils.execAsync('slurp');
            const path = GLib.get_home_dir() + '/Pictures/Screenshots';
            const file = `${path}/${now()}.png`;
            Utils.ensureDirectory(path);

            area ? await Utils.execAsync(['wayshot', '-s', area, '-f', file])
                : await Utils.execAsync(['wayshot', '-f', file]);

            Utils.execAsync(['bash', '-c', `wl-copy < ${file}`]);

            const res = await Utils.execAsync([
                'notify-send',
                '-A', 'files=Show in Files',
                '-A', 'view=View',
                '-A', 'edit=Edit',
                '-i', file,
                'Screenshot',
                file,
            ]);
            if (res === 'files')
                Utils.execAsync('xdg-open ' + path);

            if (res === 'view')
                Utils.execAsync('xdg-open ' + file);

            if (res === 'edit')
                Utils.execAsync(['swappy', '-f', file]);

            App.closeWindow('dashboard');
        } catch (error) {
            console.error(error);
        }
    }
}

export default new Recorder();
