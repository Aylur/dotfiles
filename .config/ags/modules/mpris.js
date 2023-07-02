const { Widget, Utils } = ags;
const { Mpris } = ags.Service;

Widget.widgets['mpris/box'] = ({ player, ...props }) => {
    const box = Widget({
        ...props,
        type: 'box',
        connections: [[Mpris, box => box.visible = Mpris.getPlayer(player)]],
    });
    const id = box.connect('draw', () => {
        box.visible = Mpris.getPlayer(player);
        box.disconnect(id);
    });
    return box;
};

Widget.widgets['mpris/cover-art'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'box',
    connections: [[Mpris, box => {
        const url = Mpris.getPlayer(player)?.coverPath;
        if (!url)
            return;

        box.setStyle(`background-image: url("${url}")`);
    }]],
});

Widget.widgets['mpris/title-label'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        label.label = Mpris.getPlayer(player)?.trackTitle || '';
    }]],
});


Widget.widgets['mpris/artist-label'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        label.label = Mpris.getPlayer(player)?.trackArtists.join(', ') || '';
    }]],
});

Widget.widgets['mpris/player-label'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        label.label = Mpris.getPlayer(player)?.identity || '';
    }]],
});

Widget.widgets['mpris/player-icon'] = ({ symbolic = false, player, ...props }) => Widget({
    ...props,
    type: 'icon',
    connections: [[Mpris, icon => {
        const name = `${Mpris.getPlayer(player)?.entry}${symbolic ? '-symbolic' : ''}`;
        Utils.lookUpIcon(name)
            ? icon.icon_name = name
            : icon.icon_name = 'audio-x-generic-symbolic';
    }]],
});

Widget.widgets['mpris/volume-slider'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'slider',
    onChange: value => {
        const mpris = Mpris.getPlayer(player);
        if (mpris && mpris.volume >= 0)
            Mpris.getPlayer(player).volume = value;
    },
    connections: [[Mpris, slider => {
        if (slider._dragging)
            return;

        const mpris = Mpris.getPlayer(player);
        slider.visible = mpris;
        if (mpris) {
            slider.visible = mpris.volume >= 0;
            slider.adjustment.value = mpris.volume;
        }
    }]],
});

Widget.widgets['mpris/volume-icon'] = ({ player, items, ...props }) => Widget({
    ...props,
    type: 'dynamic',
    items: items || [
        { value: 67, widget: { type: 'icon', icon: 'audio-volume-high-symbolic' } },
        { value: 34, widget: { type: 'icon', icon: 'audio-volume-medium-symbolic' } },
        { value: 1, widget: { type: 'icon', icon: 'audio-volume-low-symbolic' } },
        { value: 0, widget: { type: 'icon', icon: 'audio-volume-muted-symbolic' } },
    ],
    connections: [[Mpris, dynamic => {
        const mpris = Mpris.getPlayer(player);
        dynamic.visible = mpris?.volume >= 0;
        const value = mpris?.volume || 0;
        dynamic.update(threshold => threshold <= value*100);
    }]],
});

Widget.widgets['mpris/position-slider'] = ({ player, ...props }) => {
    const update = slider => {
        if (slider._dragging)
            return;

        const mpris = Mpris.getPlayer(player);
        slider.visible = mpris?.length > 0;
        if (mpris && mpris.length > 0)
            slider.adjustment.value = mpris.position/mpris.length;
    };
    return Utils.interval(
        Widget({
            ...props,
            type: 'slider',
            onChange: value => {
                const mpris = Mpris.getPlayer(player);
                if (mpris && mpris.length >= 0)
                    Mpris.getPlayer(player).position = mpris.length*value;
            },
            connections: [[Mpris, update]],
        }),
        1000, update,
    );
};

function _lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec0 = Math.floor(length % 60) < 10 ? '0' : '';
    const sec = Math.floor(length % 60);
    return `${min}:${sec0}${sec}`;
}

Widget.widgets['mpris/position-label'] = ({ player, ...props }) => {
    const update = label => {
        const mpris = Mpris.getPlayer(player);

        if (mpris && !label._binding) {
            label._binding = mpris.connect('position', (_, time) => {
                label.label = _lengthStr(time);
            });
            label.connect('destroy', () => {
                if (mpris)
                    mpris.disconnect(label._binding);

                label._binding = null;
            });
        }

        mpris && mpris.length > 0
            ? label.label = _lengthStr(mpris.position)
            : label.visible = mpris;

        return true;
    };

    return Utils.interval(
        Widget({
            ...props,
            type: 'label',
            connections: [[Mpris, update]],
        }),
        1000, update,
    );
};

Widget.widgets['mpris/length-label'] = ({ player, ...props }) => Widget({
    ...props,
    type: 'label',
    connections: [[Mpris, label => {
        const mpris = Mpris.getPlayer(player);
        mpris && mpris.length > 0
            ? label.label = _lengthStr(mpris.length)
            : label.visible = mpris;
    }]],
});

const _playerButton = ({ player, items, onClick, prop, canProp, cantValue, ...rest }) => Widget({
    ...rest,
    type: 'button',
    child: { type: 'dynamic', items },
    onClick: () => Mpris.getPlayer(player)?.[onClick](),
    connections: [[Mpris, button => {
        const mpris = Mpris.getPlayer(player);
        if (!mpris || mpris[canProp] === cantValue)
            return button.hide();

        button.show();
        button.get_child().update(value => value === mpris[prop]);
    }]],
});

Widget.widgets['mpris/shuffle-button'] = ({
    player,
    enabled = { type: 'icon', className: 'shuffle enabled', icon: 'media-playlist-shuffle-symbolic' },
    disabled = { type: 'icon', className: 'shuffle disabled', icon: 'media-playlist-shuffle-symbolic' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: true, widget: enabled },
        { value: false, widget: disabled },
    ],
    onClick: 'shuffle',
    prop: 'shuffleStatus',
    canProp: 'shuffleStatus',
    cantValue: null,
});

Widget.widgets['mpris/loop-button'] = ({
    player,
    none = { type: 'icon', className: 'loop none', icon: 'media-playlist-repeat-symbolic' },
    track = { type: 'icon', className: 'loop track', icon: 'media-playlist-repeat-song-symbolic' },
    playlist = { type: 'icon', className: 'loop playlist', icon: 'media-playlist-repeat-symbolic' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: 'None', widget: none },
        { value: 'Track', widget: track },
        { value: 'Playlist', widget: playlist },
    ],
    onClick: 'loop',
    prop: 'loopStatus',
    canProp: 'loopStatus',
    cantValue: null,
});

Widget.widgets['mpris/play-pause-button'] = ({
    player,
    playing = { type: 'icon', className: 'playing', icon: 'media-playback-pause-symbolic' },
    paused = { type: 'icon', className: 'paused', icon: 'media-playback-start-symbolic' },
    stopped = { type: 'icon', className: 'stopped', icon: 'media-playback-start-symbolic' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: 'Playing', widget: playing },
        { value: 'Paused', widget: paused },
        { value: 'Stopped', widget: stopped },
    ],
    onClick: 'playPause',
    prop: 'playBackStatus',
    canProp: 'canPlay',
    cantValue: false,
});

Widget.widgets['mpris/previous-button'] = ({
    player,
    child = { type: 'icon', className: 'previous', icon: 'media-skip-backward-symbolic' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: true, widget: child },
    ],
    onClick: 'previous',
    prop: 'canGoPrev',
    canProp: 'canGoPrev',
    cantValue: false,
});

Widget.widgets['mpris/next-button'] = ({
    player,
    child = { type: 'icon', className: 'next', icon: 'media-skip-forward-symbolic' },
    ...props
}) => _playerButton({
    ...props,
    player,
    items: [
        { value: true, widget: child },
    ],
    onClick: 'next',
    prop: 'canGoNext',
    canProp: 'canGoNext',
    cantValue: false,
});
