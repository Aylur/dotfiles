// dependencies: slurp wf-recorder watershot libnotify

const { Service, Widget } = ags;
const { execAsync, interval, ensureDirectory } = ags.Utils;
const { GLib } = imports.gi;
const now = () => GLib.DateTime.new_now_local().format('%Y-%m-%d_%H-%M-%S');

class RecorderService extends Service {
    static {
        Service.register(this, {
            'timer': [imports.gi.GObject.TYPE_INT],
        });
    }

    _path = GLib.get_home_dir()+'/Videos/Screencasting';

    start() {
        execAsync('slurp', out => {
            ensureDirectory(this._path);
            this._file = `${this._path}/${now()}.mp4`;
            execAsync(['wf-recorder', '-g', out.trim(), '-f', this._file]);
            this._recording = true;
            this.emit('changed');

            this._timer = 0;
            this._interval = interval(null, 1000, () => {
                this.emit('timer', this._timer);
                this._timer++;
            });
        });
    }

    stop() {
        execAsync('killall -INT wf-recorder');
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
        ], res => {
            if (res.trim() === 'files')
                execAsync('xdg-open '+this._path);

            if (res.trim() === 'view')
                execAsync('xdg-open '+this._file);
        });
    }

    constructor() {
        super();

        this._timer = 0;
        this._recording = false;
    }
}

class Recorder {
    static { Service.export(this, 'Recorder'); }
    static instance = new RecorderService();
    static start() { Recorder.instance.start() }
    static stop() { Recorder.instance.stop() }
}

class Screenshot extends Service {
    static {
        Service.register(this);
        Service.export(this, 'Screenshot');
    }

    static PATH = GLib.get_home_dir()+'/Pictures/Screenshots';
    static instance = new Screenshot();

    static shot() {
        ensureDirectory(Screenshot.PATH);
        const file = `${Screenshot.PATH}/${now()}.png`;
        execAsync(`watershot -c -s path ${file}`);
        const id = interval(null, 100, () => {
            if (!GLib.file_test(file, GLib.FileTest.EXISTS))
                return;

            execAsync([
                'notify-send',
                '-A', 'files=Show in Files',
                '-A', 'view=View',
                '-i', file,
                'Screenshot',
                file,
            ], res => {
                if (res.trim() === 'files')
                    execAsync('xdg-open '+Screenshot.PATH);

                if (res.trim() === 'view')
                    execAsync('xdg-open '+file);
            });

            GLib.source_remove(id);
        });
    }
}

Widget.widgets['recorder/indicator-button'] = props => Widget({
    ...props,
    type: 'button',
    className: 'recorder',
    hexpand: true,
    onClick: Recorder.stop,
    child: {
        type: 'box',
        children: [
            {
                type: 'icon',
                icon: 'media-record-symbolic',
            },
            {
                type: 'label',
                connections: [[Recorder, (label, time) => {
                    const sec = time % 60;
                    const min = Math.floor(time / 60);
                    label.label = `${min}:${sec < 10 ? '0'+sec : sec}`;
                }, 'timer']],
            },
        ],
    },
    connections: [[Recorder, button => {
        button.visible = Recorder.instance._recording;
    }]],
});

Widget.widgets['screenshot/button'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Screenshot.shot,
});
