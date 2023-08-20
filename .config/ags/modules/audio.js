const { Audio } = ags.Service;
const { Label, Box, Icon, Stack, Button, Slider } = ags.Widget;

const iconSubstitute = item => {
    const substitues = [
        { from: 'audio-headset-bluetooth', to: 'audio-headphones-symbolic' },
        { from: 'audio-card-analog-usb', to: 'audio-speakers-symbolic' },
        { from: 'audio-card-analog-pci', to: 'audio-card-symbolic' },
    ];

    for (const { from, to } of substitues) {
        if (from === item)
            return to;
    }
    return item;
};

export const SpeakerIndicator = ({
    items = [
        ['101', Icon('audio-volume-overamplified-symbolic')],
        ['67', Icon('audio-volume-high-symbolic')],
        ['34', Icon('audio-volume-medium-symbolic')],
        ['1', Icon('audio-volume-low-symbolic')],
        ['0', Icon('audio-volume-muted-symbolic')],
    ],
    ...props
} = {}) => Stack({
    ...props,
    items,
    connections: [[Audio, stack => {
        if (!Audio.speaker)
            return;

        if (Audio.speaker.isMuted)
            return stack.shown = '0';

        const vol = Audio.speaker.volume * 100;
        for (const threshold of [100, 66, 33, 0, -1]) {
            if (vol > threshold + 1)
                return stack.shown = `${threshold + 1}`;
        }
    }, 'speaker-changed']],
});

export const SpeakerTypeIndicator = props => Icon({
    ...props,
    connections: [[Audio, icon => {
        if (Audio.speaker)
            icon.icon = iconSubstitute(Audio.speaker.iconName);
    }]],
});

export const SpeakerPercentLabel = props => Label({
    ...props,
    connections: [[Audio, label => {
        if (!Audio.speaker)
            return;

        label.label = `${Math.floor(Audio.speaker.volume * 100)}%`;
    }, 'speaker-changed']],
});

export const SpeakerSlider = props => Slider({
    ...props,
    drawValue: false,
    onChange: ({ value }) => Audio.speaker.volume = value,
    connections: [[Audio, slider => {
        if (!Audio.speaker)
            return;

        slider.sensitive = !Audio.speaker.isMuted;
        slider.value = Audio.speaker.volume;
    }, 'speaker-changed']],
});

export const MicrophoneMuteIndicator = ({
    muted = Icon('microphone-disabled-symbolic'),
    unmuted = Icon('microphone-sensitivity-high-symbolic'),
    ...props
} = {}) => Stack({
    ...props,
    items: [
        ['true', muted],
        ['false', unmuted],
    ],
    connections: [[Audio, stack => {
        stack.shown = `${Audio.microphone?.isMuted}`;
    }, 'microphone-changed']],
});

export const MicrophoneMuteToggle = props => Button({
    ...props,
    onClicked: 'pactl set-source-mute @DEFAULT_SOURCE@ toggle',
    connections: [[Audio, button => {
        if (!Audio.microphone)
            return;

        button.toggleClassName('on', Audio.microphone.isMuted);
    }, 'microphone-changed']],
});

export const AppMixer = props => {
    const AppItem = stream => {
        const icon = Icon();
        const label = Label({ xalign: 0, justify: 'left', wrap: true, ellipsize: 3 });
        const percent = Label({ xalign: 1 });
        const slider = Slider({
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => {
                stream.volume = value;
            },
        });
        const sync = () => {
            icon.icon = stream.iconName;
            icon.tooltipText = stream.name;
            slider.value = stream.volume;
            percent.label = `${Math.floor(stream.volume * 100)}%`;
            label.label = stream.description || '';
        };
        const id = stream.connect('changed', sync);
        return Box({
            hexpand: true,
            children: [
                icon,
                Box({
                    children: [
                        Box({
                            vertical: true,
                            children: [
                                label,
                                slider,
                            ],
                        }),
                        percent,
                    ],
                }),
            ],
            connections: [['destroy', () => stream.disconnect(id)]],
            setup: sync,
        });
    };

    return Box({
        ...props,
        vertical: true,
        connections: [[Audio, box => {
            box.children = Array.from(Audio.apps.values())
                .map(stream => AppItem(stream));
        }]],
    });
};

export const StreamSelector = ({ streams = 'speakers', ...props } = {}) => Box({
    ...props,
    vertical: true,
    connections: [[Audio, box => {
        box.children = Array.from(Audio[streams].values()).map(stream => Button({
            child: Box({
                children: [
                    Icon({
                        icon: iconSubstitute(stream.iconName),
                        tooltipText: stream.iconName,
                    }),
                    Label(stream.description.split(' ').slice(0, 4).join(' ')),
                    Icon({
                        icon: 'object-select-symbolic',
                        hexpand: true,
                        halign: 'end',
                        connections: [['draw', icon => {
                            icon.visible = Audio.speaker === stream;
                        }]],
                    }),
                ],
            }),
            onClicked: () => {
                if (streams === 'speakers')
                    Audio.speaker = stream;

                if (streams === 'microphones')
                    Audio.microphone = stream;
            },
        }));
    }]],
});
