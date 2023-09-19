import icons from '../../icons.js';
import FontIcon from '../../misc/FontIcon.js';
import Separator from '../../misc/Separator.js';
import { getAudioTypeIcon } from '../../utils.js';
import { Arrow } from '../ToggleButton.js';
import { Menu } from '../ToggleButton.js';
const { Audio } = ags.Service;
const { Label, Icon, Box, Slider, Button } = ags.Widget;

const TypeIndicator = () => Button({
    onClicked: 'pactl set-sink-mute @DEFAULT_SINK@ toggle',
    child: Icon({
        connections: [[Audio, icon => {
            if (!Audio.speaker)
                return;

            icon.icon = getAudioTypeIcon(Audio.speaker.iconName);
            icon.tooltipText = `Volume ${Math.floor(Audio.speaker.volume * 100)}%`;
        }, 'speaker-changed']],
    }),
});

const VolumeSlider = () => Slider({
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => Audio.speaker.volume = value,
    connections: [[Audio, slider => {
        if (!Audio.speaker)
            return;

        slider.sensitive = !Audio.speaker.isMuted;
        slider.value = Audio.speaker.volume;
    }, 'speaker-changed']],
});

export const Volume = () => Box({
    className: 'slider',
    children: [
        TypeIndicator(),
        VolumeSlider(),
        Arrow('sink-selector'),
        Box({
            children: [Arrow('app-mixer')],
            connections: [[Audio, box => {
                box.visible = Array.from(Audio.apps).length > 0;
            }]],
        }),
    ],
});

const MixerItem = stream => Box({
    hexpand: true,
    className: 'mixer-item',
    children: [
        Icon({
            binds: [['tooltipText', stream, 'name']],
            connections: [[stream, icon => {
                icon.icon = ags.Utils.lookUpIcon(stream.name)
                    ? stream.name
                    : icons.mpris.fallback;
            }]],
        }),
        Box({
            children: [
                Box({
                    vertical: true,
                    children: [
                        Label({
                            xalign: 0,
                            truncate: 'end',
                            binds: [['label', stream, 'description']],
                        }),
                        Slider({
                            hexpand: true,
                            drawValue: false,
                            binds: [['value', stream, 'volume']],
                            onChange: ({ value }) => {
                                stream.volume = value;
                            },
                        }),
                    ],
                }),
                Label({
                    xalign: 1,
                    connections: [[stream, l => {
                        l.label = `${Math.floor(stream.volume * 100)}%`;
                    }]],
                }),
            ],
        }),
    ],
});

const SinkItem = stream => Button({
    hexpand: true,
    onClicked: () => Audio.speaker = stream,
    child: Box({
        children: [
            Icon({
                icon: getAudioTypeIcon(stream.iconName),
                tooltipText: stream.iconName,
            }),
            Label(stream.description.split(' ').slice(0, 4).join(' ')),
            Icon({
                icon: icons.tick,
                hexpand: true,
                halign: 'end',
                connections: [['draw', icon => {
                    icon.visible = Audio.speaker === stream;
                }]],
            }),
        ],
    }),
});

const SettingsButton = () => Button({
    onClicked: 'pavucontrol',
    hexpand: true,
    child: Box({
        children: [
            Icon(icons.settings),
            Label('Settings'),
        ],
    }),
});

export const AppMixer = () => Menu({
    name: 'app-mixer',
    icon: FontIcon(icons.audio.mixer),
    title: Label('App Mixer'),
    content: Box({
        className: 'app-mixer',
        vertical: true,
        children: [
            Box({
                vertical: true,
                connections: [[Audio, box => {
                    box.children = Audio.apps.map(MixerItem);
                }]],
            }),
            Separator({ orientation: 'horizontal' }),
            SettingsButton(),
        ],
    }),
});

export const SinkSelector = () => Menu({
    name: 'sink-selector',
    icon: Icon(icons.audio.type.headset),
    title: Label('Sink Selector'),
    content: Box({
        className: 'sink-selector',
        vertical: true,
        children: [
            Box({
                vertical: true,
                connections: [[Audio, box => {
                    box.children = Audio.speakers.map(SinkItem);
                }]],
            }),
            Separator({ orientation: 'horizontal' }),
            SettingsButton(),
        ],
    }),
});
