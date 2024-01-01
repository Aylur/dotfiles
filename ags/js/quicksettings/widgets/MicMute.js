import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';

export default () => SimpleToggleButton({
    icon: Widget.Icon()
        .hook(Audio, self => {
            self.icon = Audio.microphone?.is_muted
                ? icons.audio.mic.muted
                : icons.audio.mic.high;
        }, 'microphone-changed'),
    toggle: () => Audio.microphone.is_muted = !Audio.microphone.is_muted,
    connection: [Audio, () => Audio.microphone?.is_muted || false],
});
