const { Service } = ags;
const { execAsync, interval, ensureDirectory } = ags.Utils;
const { Button, Box, Icon, Label } = ags.Widget;
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

    async screenshot() {
        try {
            const area = await execAsync('slurp');
            const path = GLib.get_home_dir() + '/Pictures/Screenshots';
            const file = `${path}/${now()}.png`;
            ensureDirectory(path);

            await execAsync(['wayshot', '-s', area, '-f', file]);
            execAsync(['bash', '-c', `wl-copy < ${file}`]);

            const res = await execAsync([
                'notify-send',
                '-A', 'files=Show in Files',
                '-A', 'view=View',
                '-i', file,
                'Screenshot',
                file,
            ]);
            if (res === 'files')
                execAsync('xdg-open ' + path);

            if (res === 'view')
                execAsync('xdg-open ' + file);
        } catch (error) {
            logError(error);
        }
    }
}

class Recorder {
    static { Service.export(this, 'Recorder'); }
    static instance = new RecorderService();
    static start() { Recorder.instance.start(); }
    static stop() { Recorder.instance.stop(); }
    static screenshot() { Recorder.instance.screenshot(); }
}

export const PanelButton = props => Button({
    ...props,
    className: 'recorder panel-button',
    onClicked: Recorder.stop,
    child: Box({
        children: [
            Icon('media-record-symbolic'),
            Label({
                connections: [[Recorder, (label, time) => {
                    const sec = time % 60;
                    const min = Math.floor(time / 60);
                    label.label = `${min}:${sec < 10 ? '0' + sec : sec}`;
                }, 'timer']],
            }),
        ],
    }),
    connections: [[Recorder, button => {
        button.visible = Recorder.instance._recording;
    }]],
});
