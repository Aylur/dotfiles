const { Service, Widget } = ags;
const { execAsync, ensureDirectory } = ags.Utils;
const { GLib } = imports.gi;

const PATH = GLib.get_home_dir()+'/Videos/Screencasting';

class Recorder extends Service {
    static {
        Service.register(this);
        Service.export(this, 'Recorder');
    }

    static instance = new Recorder();

    static start() {
        execAsync('slurp', out => {
            const file = GLib.DateTime.new_now_local().format('%Y%m%d%H%M%S')+'.mp4';
            ensureDirectory(PATH);
            execAsync(['wf-recorder', '-g', out.trim(), '-f', PATH+'/'+file]);
            Recorder.instance._recording = true;
            Recorder.instance.emit('changed');
        }, print);
    }

    static stop() {
        execAsync('killall -INT wf-recorder');
        Recorder.instance._recording = false;
        Recorder.instance.emit('changed');
    }

    constructor() {
        super();

        this._recording = false;
    }
}

Widget.widgets['recorder/indicator-button'] = props => Widget({
    ...props,
    type: 'button',
    className: 'recorder',
    hexpand: true,
    onClick: Recorder.stop,
    child: {
        type: 'icon',
        icon: 'media-record-symbolic',
    },
    connections: [[Recorder, button => {
        button.visible = Recorder.instance._recording;
    }]],
});
