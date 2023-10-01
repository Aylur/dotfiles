import PanelButton from '../PanelButton.js';
import Recorder from '../../services/screenrecord.js';
import icons from '../../icons.js';
import { Widget } from '../../imports.js';

export default () => PanelButton({
    className: 'recorder',
    onClicked: () => Recorder.stop(),
    binds: [['visible', Recorder, 'recording']],
    child: Widget.Box({
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
