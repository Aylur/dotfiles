import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';
import { Audio, Widget } from '../../imports.js';

export default () => SimpleToggleButton({
    icon: Widget.Icon({
        connections: [[Audio, icon => {
            icon.icon = Audio.microphone?.isMuted
                ? icons.audio.mic.muted
                : icons.audio.mic.unmuted;
        }, 'microphone-changed']],
    }),
    toggle: () => Audio.microphone.isMuted = !Audio.microphone.isMuted,
    connection: [Audio, () => Audio.microphone?.isMuted],
});
