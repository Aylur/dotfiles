import icons from '../../icons.js';
import FontIcon from '../../misc/FontIcon.js';
import Separator from '../../misc/Separator.js';
import { getAudioTypeIcon } from '../../utils.js';
import { Arrow } from '../ToggleButton.js';
import { Menu } from '../ToggleButton.js';
import { Audio, Widget, Utils } from '../../imports.js';

const TypeIndicator = () => Widget.Button({
    onClicked: () => Audio.speaker.isMuted = !Audio.speaker.isMuted,
    child: Widget.Icon({
        connections: [[Audio, icon => {
            if (!Audio.speaker)
                return;

            icon.icon = getAudioTypeIcon(Audio.speaker.iconName);
            icon.tooltipText = `Volume ${Math.floor(Audio.speaker.volume * 100)}%`;
        }, 'speaker-changed']],
    }),
});

const VolumeSlider = () => Widget.Slider({
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => Audio.speaker.volume = value,
    connections: [[Audio, slider => {
        slider.value = Audio.speaker?.volume;
    }, 'speaker-changed']],
});

export const Volume = () => Widget.Box({
    className: 'slider',
    children: [
        TypeIndicator(),
        VolumeSlider(),
        Arrow('sink-selector'),
        Widget.Box({
            children: [Arrow('app-mixer')],
            connections: [[Audio, box => {
                box.visible = Array.from(Audio.apps).length > 0;
            }]],
        }),
    ],
});

const MixerItem = stream => Widget.Box({
    hexpand: true,
    className: 'mixer-item',
    children: [
        Widget.Icon({
            binds: [['tooltipText', stream, 'name']],
            connections: [[stream, icon => {
                icon.icon = Utils.lookUpIcon(stream.name)
                    ? stream.name
                    : icons.mpris.fallback;
            }]],
        }),
        Widget.Box({
            children: [
                Widget.Box({
                    vertical: true,
                    children: [
                        Widget.Label({
                            xalign: 0,
                            truncate: 'end',
                            binds: [['label', stream, 'description']],
                        }),
                        Widget.Slider({
                            hexpand: true,
                            drawValue: false,
                            binds: [['value', stream, 'volume']],
                            onChange: ({ value }) => stream.volume = value,
                        }),
                    ],
                }),
                Widget.Label({
                    xalign: 1,
                    connections: [[stream, l => {
                        l.label = `${Math.floor(stream.volume * 100)}%`;
                    }]],
                }),
            ],
        }),
    ],
});

const SinkItem = stream => Widget.Button({
    hexpand: true,
    onClicked: () => Audio.speaker = stream,
    child: Widget.Box({
        children: [
            Widget.Icon({
                icon: getAudioTypeIcon(stream.iconName),
                tooltipText: stream.iconName,
            }),
            Widget.Label(stream.description.split(' ').slice(0, 4).join(' ')),
            Widget.Icon({
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

const SettingsButton = () => Widget.Button({
    onClicked: 'pavucontrol',
    hexpand: true,
    child: Widget.Box({
        children: [
            Widget.Icon(icons.settings),
            Widget.Label('Settings'),
        ],
    }),
});

export const AppMixer = () => Menu({
    name: 'app-mixer',
    icon: FontIcon(icons.audio.mixer),
    title: Widget.Label('App Mixer'),
    content: Widget.Box({
        className: 'app-mixer',
        vertical: true,
        children: [
            Widget.Box({
                vertical: true,
                binds: [['children', Audio, 'apps', a => a.map(MixerItem)]],
            }),
            Separator({ orientation: 'horizontal' }),
            SettingsButton(),
        ],
    }),
});

export const SinkSelector = () => Menu({
    name: 'sink-selector',
    icon: Widget.Icon(icons.audio.type.headset),
    title: Widget.Label('Sink Selector'),
    content: Widget.Box({
        className: 'sink-selector',
        vertical: true,
        children: [
            Widget.Box({
                vertical: true,
                connections: [[Audio, box => {
                    box.children = Audio.speakers.map(SinkItem);
                }, 'notify::speaker']],
            }),
            Separator({ orientation: 'horizontal' }),
            SettingsButton(),
        ],
    }),
});
