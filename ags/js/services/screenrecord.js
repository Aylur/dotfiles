import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import GLib from 'gi://GLib';
import { dependencies } from '../utils.js';

const now = () => GLib.DateTime.new_now_local().format('%Y-%m-%d_%H-%M-%S');

class Recorder extends Service {
    static {
        Service.register(this, {}, {
            'timer': ['int'],
            'recording': ['boolean'],
        });
    }

    #path = GLib.get_home_dir() + '/Videos/Screencasting';
    #file = '';
    #interval = 0;

    recording = false;
    timer = 0;

    async start() {
        if (!dependencies(['slurp', 'wf-recorder']))
            return;

        if (this.recording)
            return;

        const area = await Utils.execAsync('slurp');
        Utils.ensureDirectory(this.#path);
        this.#file = `${this.#path}/${now()}.mp4`;
        Utils.execAsync(['wf-recorder', '-g', area, '-f', this.#file]);
        this.recording = true;
        this.changed('recording');

        this.timer = 0;
        this.#interval = Utils.interval(1000, () => {
            this.changed('timer');
            this.timer++;
        });
    }

    async stop() {
        if (!dependencies(['notify-send']))
            return;

        if (!this.recording)
            return;

        Utils.execAsync('killall -INT wf-recorder');
        this.recording = false;
        this.changed('recording');
        GLib.source_remove(this.#interval);

        const res = await Utils.execAsync([
            'notify-send',
            '-A', 'files=Show in Files',
            '-A', 'view=View',
            '-i', 'video-x-generic-symbolic',
            'Screenrecord',
            this.#file,
        ]);

        if (res === 'files')
            Utils.execAsync('xdg-open ' + this.#path);

        if (res === 'view')
            Utils.execAsync('xdg-open ' + this.#file);
    }

    async screenshot(full = false) {
        if (!dependencies(['slurp', 'wayshot']))
            return;

        const path = GLib.get_home_dir() + '/Pictures/Screenshots';
        const file = `${path}/${now()}.png`;
        Utils.ensureDirectory(path);

        await Utils.execAsync([
            'wayshot',
            '-f', file,
        ].concat(full ? [] : [
            '-s', await Utils.execAsync('slurp'),
        ]));

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
    }
}

export default new Recorder();
