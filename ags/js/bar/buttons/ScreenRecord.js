import PanelButton from '../PanelButton.js';
import Recorder from '../../services/screenrecord.js';
import icons from '../../icons.js';
const { Box, Icon, Label } = ags.Widget;

export default () => PanelButton({
    className: 'recorder',
    onClicked: Recorder.stop,
    binds: [['visible', Recorder, 'recording']],
    child: Box({
        children: [
            Icon(icons.recorder.recording),
            Label({
                connections: [[Recorder, (label, time) => {
                    const sec = time % 60;
                    const min = Math.floor(time / 60);
                    label.label = `${min}:${sec < 10 ? '0' + sec : sec}`;
                }, 'timer']],
            }),
        ],
    }),
});
