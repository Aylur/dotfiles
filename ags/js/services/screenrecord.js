const { Service } = ags;
const { execAsync, interval, ensureDirectory } = ags.Utils;
const { GLib } = imports.gi;
const now = () => GLib.DateTime.new_now_local().format('%Y-%m-%d_%H-%M-%S');

class RecorderService extends Service {
    static {
        Service.register(this, { 'timer': ['int'] });
    }

    _path = GLib.get_home_dir() + '/Videos/Screencasting';
    _timer = 0;
    _recording = false;
    _screenshotting = false;

    start() {
        if (this._recording)
            return;

        execAsync('slurp')
            .then(area => {
                ensureDirectory(this._path);
                this._file = `${this._path}/${now()}.mp4`;
                execAsync(['wf-recorder', '-g', area, '-f', this._file]);
                this._recording = true;
                this.emit('changed');

                this._timer = 0;
                this._interval = interval(1000, () => {
                    this.emit('timer', this._timer);
                    this._timer++;
                });
            })
            .catch(print);
    }

    stop() {
        if (!this._recording)
            return;

        execAsync('killall -INT wf-recorder').catch(print);
        this._recording = false;
        this.emit('changed');
        GLib.source_remove(this._interval);
        execAsync([
            'notify-send',
            '-A', 'files=Show in Files',
            '-A', 'view=View',
            '-i', 'video-x-generic-symbolic',
            'Screenrecord',
            this._file,
        ])
            .then(res => {
                if (res === 'files')
                    execAsync('xdg-open ' + this._path);

                if (res === 'view')
                    execAsync('xdg-open ' + this._file);
            })
            .catch(print);
    }

    async screenshot(full = false) {
        try {
            const area = full ? null : await execAsync('slurp');
            const path = GLib.get_home_dir() + '/Pictures/Screenshots';
            const file = `${path}/${now()}.png`;
            ensureDirectory(path);

            area ? await execAsync(['wayshot', '-s', area, '-f', file])
                : await execAsync(['wayshot', '-f', file]);

            execAsync(['bash', '-c', `wl-copy < ${file}`]);

            const res = await execAsync([
                'notify-send',
                '-A', 'files=Show in Files',
                '-A', 'view=View',
                '-A', 'edit=Edit',
                '-i', file,
                'Screenshot',
                file,
            ]);
            if (res === 'files')
                execAsync('xdg-open ' + path);

            if (res === 'view')
                execAsync('xdg-open ' + file);

            if (res === 'edit')
                execAsync(['swappy', '-f', file]);

            ags.App.closeWindow('dashboard');
        } catch (error) {
            console.error(error);
        }
    }
}

export default class Recorder {
    static { Service.Recorder = this; }
    static instance = new RecorderService();
    static start() { Recorder.instance.start(); }
    static stop() { Recorder.instance.stop(); }
    static screenshot(full) { Recorder.instance.screenshot(full); }
    static get recording() { return Recorder.instance._recording; }
}
