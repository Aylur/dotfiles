import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PanelButton from '../PanelButton.js';
import Recorder from '../../services/screenrecord.js';
import icons from '../../icons.js';

export default () => PanelButton({
    class_name: 'recorder',
    on_clicked: () => Recorder.stop(),
    binds: [['visible', Recorder, 'recording']],
    content: Widget.Box({
        children: [
            Widget.Icon(icons.recorder.recording),
            Widget.Label({
                binds: [['label', Recorder, 'timer', time => {
                    const sec = time % 60;
                    const min = Math.floor(time / 60);
                    return `${min}:${sec < 10 ? '0' + sec : sec}`;
                }]],
            }),
        ],
    }),
});
