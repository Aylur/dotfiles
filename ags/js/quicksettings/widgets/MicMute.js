import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';
const { Audio } = ags.Service;
const { Icon } = ags.Widget;

export default () => SimpleToggleButton({
    icon: Icon({
        connections: [[Audio, icon => {
            icon.icon = Audio.microphone?.isMuted
                ? icons.audio.mic.muted
                : icons.audio.mic.unmuted;
        }, 'microphone-changed']],
    }),
    toggle: 'pactl set-source-mute @DEFAULT_SOURCE@ toggle',
    connection: [Audio, () => Audio.microphone?.isMuted],
});
