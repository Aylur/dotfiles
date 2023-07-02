const { Widget } = ags;
const { Audio } = ags.Service;

function _connectStream({ stream, widget, callback }) {
    widget = Widget(widget);
    Audio.connect(widget, () => {
        if (widget[stream] === Audio[stream])
            return;

        const disconnect = () => {
            if (widget._id) {
                widget[stream].disconnect(widget._id);
                widget._id = null;
            }
        };
        widget.connect('destroy', disconnect);
        disconnect();

        widget[stream] = Audio[stream];
        widget._id = widget[stream].connect('changed', () => callback(widget));
        callback(widget);
    });
    return widget;
}

Widget.widgets['audio/speaker-indicator'] = ({ items, ...props }) => {
    items ||= [
        { value: 101, widget: { type: 'icon', icon: 'audio-volume-overamplified-symbolic' } },
        { value: 67, widget: { type: 'icon', icon: 'audio-volume-high-symbolic' } },
        { value: 34, widget: { type: 'icon', icon: 'audio-volume-medium-symbolic' } },
        { value: 1, widget: { type: 'icon', icon: 'audio-volume-low-symbolic' } },
        { value: 0, widget: { type: 'icon', icon: 'audio-volume-muted-symbolic' } },
    ];
    return _connectStream({
        stream: 'speaker',
        widget: { ...props, type: 'dynamic', items },
        callback: dynamic => dynamic.update(value => {
            if (Audio.speaker.isMuted)
                return value === 0;

            return value <= (Audio.speaker.volume*100);
        }),
    });
};

Widget.widgets['audio/speaker-label'] = props => _connectStream({
    stream: 'speaker',
    widget: { ...props, type: 'label' },
    callback: label => label.label = `${Math.floor(Audio.speaker.volume*100)}`,
});

Widget.widgets['audio/speaker-slider'] = props => _connectStream({
    stream: 'speaker',
    widget: Widget({
        ...props,
        type: 'slider',
        onChange: value => Audio.speaker.volume = value,
    }),
    callback: slider => {
        slider.adjustment.value = Audio.speaker.volume;
        slider.sensitive = !Audio.speaker.isMuted;
    },
});

Widget.widgets['audio/microphone-mute-indicator'] = ({
    muted = Widget({ type: 'icon', icon: 'microphone-disabled-symbolic' }),
    unmuted = Widget({ type: 'icon', icon: 'microphone-sensitivity-high-symbolic' }),
    ...props
}) => _connectStream({
    stream: 'microphone',
    widget: Widget({
        ...props,
        type: 'dynamic',
        items: [
            { value: true, widget: muted },
            { value: false, widget: unmuted },
        ],
    }),
    callback: dynamic => dynamic.update(value => value === Audio.microphone?.isMuted),
});

Widget.widgets['audio/microphone-mute-toggle'] = props => _connectStream({
    stream: 'microphone',
    widget: Widget({
        ...props,
        type: 'button',
        onClick: () => {
            if (!Audio.microphone)
                return;

            Audio.microphone.isMuted = !Audio.microphone.isMuted;
        },
    }),
    callback: button => {
        if (!Audio.microphone)
            return;

        button.toggleClassName(Audio.microphone.isMuted, 'on');
    },
});

Widget.widgets['audio/app-mixer'] = ({ item, ...props }) => {
    item ||= stream => {
        const icon = Widget({ type: 'icon' });
        const label = Widget({ type: 'label', xalign: 0, justify: 'left', wrap: true });
        const percent = Widget({ type: 'label', xalign: 1 });
        const slider = Widget({
            type: 'slider',
            hexpand: true,
            onChange: value => stream.volume = value,
        });
        const box = Widget({
            type: 'box',
            hexpand: true,
            children: [
                icon,
                Widget({
                    type: 'box',
                    hexpand: true,
                    orientation: 'vertical',
                    children: [
                        label,
                        {
                            type: 'box',
                            children: [
                                slider,
                                percent,
                            ],
                        },
                    ],
                }),
            ],
        });
        box.update = () => {
            icon.icon_name = stream.iconName;
            icon.set_tooltip_text(stream.name);
            slider.set_value(stream.volume);
            percent.label = `${Math.floor(stream.volume*100)}%`;
            stream.description.length > 37
                ? label.label = stream.description.substring(0, 37)+'..'
                : label.label = stream.description;
        };
        return box;
    };

    return Widget({
        ...props,
        type: 'box',
        orientation: 'vertical',
        connections: [[Audio, box => {
            box.get_children().forEach(ch => ch.destroy());
            for (const [, stream] of Audio.apps) {
                const app = item(stream);
                box.add(app);
                const id1 = stream.connect('changed', () => app.update());
                const id2 = stream.connect('closed', () => stream.disconnect(id1));
                app.connect('destroy', () => {
                    stream.disconnect(id1);
                    stream.disconnect(id2);
                });
                app.update();
            }

            box.show_all();
        }]],
    });
};
