import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PanelButton from '../PanelButton.js';
import Recorder from '../../services/screenrecord.js';
import icons from '../../icons.js';

export default () => PanelButton({
    class_name: 'recorder',
    on_clicked: () => Recorder.stop(),
    visible: Recorder.bind('recording'),
    content: Widget.Box({
        children: [
            Widget.Icon(icons.recorder.recording),
            Widget.Label({
                label: Recorder.bind('timer').transform(time => {
                    const sec = time % 60;
                    const min = Math.floor(time / 60);
                    return `${min}:${sec < 10 ? '0' + sec : sec}`;
                }),
            }),
        ],
    }),
});
