const { App, Widget } = ags;
const { Mpris } = ags.Service;

const prefer = player => players => {
    let last;
    for (const [name, mpris] of players) {
        if (name.includes(player))
            return mpris;

        last = mpris;
    }

    return last;
};

const slash = player => ({
    type: 'label', label: '/',
    connections: [
        [Mpris, label => {
            const mpris = Mpris.getPlayer(player);
            label.visible = mpris && mpris.state.length > 0
        }],
    ],
});

const mediabox = (player, className) => ({
    type: 'mpris/box', player,
    className: `media ${className}`,
    children: [
        {
            type: 'mpris/cover-art', player,
            className: 'cover-art',
            hexpand: true,
            vexpand: true,
            children : [{
                type: 'box',
                className: 'shader',
                orientation: 'vertical',
                hexpand: true,
                children: [
                    { className: 'label-box',
                        type: 'box',
                        orientation: 'vertical',
                        vexpand: true,
                        children: [
                            { type: 'mpris/title-label', xalign: 0, justify: 'left', wrap: true, className: 'title', player },
                            { type: 'mpris/artist-label', xalign: 0, className: 'artist', player },
                        ],
                    },
                    { type: 'mpris/position-slider', className: 'position-slider', player },
                    { className: 'centerbox',
                        type: 'centerbox',
                        children: [
                            { className: 'player',
                                type: 'box',
                                children: [
                                    { type: 'mpris/player-icon', className: 'icon', player, halign: 'start', size: 18, symbolic: true },
                                    { type: 'mpris/player-label', player, halign: 'start' },
                                ],
                            },
                            { type: 'box',
                                className: 'controls',
                                children: [
                                    { type: 'mpris/shuffle-button', player,
                                        enabled: { type: 'icon', className: 'shuffle enabled', icon: 'media-playlist-shuffle-symbolic' },
                                        disabled: { type: 'icon', className: 'shuffle disabled', icon: 'media-playlist-shuffle-symbolic' },
                                    },
                                    { type: 'mpris/previous-button', player,
                                        child: { type: 'icon', className: 'previous', icon: 'media-skip-backward-symbolic' }
                                    },
                                    { type: 'mpris/play-pause-button', player,
                                        playing: { type: 'icon', className: 'playing', icon: 'media-playback-pause-symbolic' },
                                        paused: { type: 'icon', className: 'paused', icon: 'media-playback-start-symbolic' },
                                        stopped: { type: 'icon', className: 'stopped', icon: 'media-playback-stop-symbolic' },
                                    },
                                    { type: 'mpris/next-button', player,
                                        child: { type: 'icon', className: 'previous', icon: 'media-skip-forward-symbolic' }
                                    },
                                    { type: 'mpris/loop-button', player,
                                        none: { type: 'icon', className: 'loop none', icon: 'media-playlist-repeat-symbolic' },
                                        track: { type: 'icon', className: 'loop track', icon: 'media-playlist-repeat-song-symbolic' },
                                        playlist: { type: 'icon', className: 'loop playlist', icon: 'media-playlist-repeat-symbolic' },
                                    }
                                ],
                            },
                            { type: 'box',
                                className: 'length',
                                halign: 'end',
                                children: [
                                    { type: 'mpris/position-label', player },
                                    slash(player),
                                    { type: 'mpris/length-label', player },
                                ]
                            }
                        ]
                    }
                ]
            }]
        },
        { className: 'volume-box',
            type: 'box',
            orientation: 'vertical',
            vexpand: true,
            children: [
                { className: 'slider',
                    type: 'mpris/volume-slider', player,
                    orientation: 'vertical',
                    inverted: true,
                    vexpand: true
                },
                { className: 'icon',
                    type: 'mpris/volume-icon', player, halign: 'center', items: [
                    { value: 67, widget: { type: 'icon', icon: 'audio-volume-high-symbolic', size: 18 } },
                    { value: 34, widget: { type: 'icon', icon: 'audio-volume-medium-symbolic', size: 18 } },
                    { value: 1, widget: { type: 'icon', icon: 'audio-volume-low-symbolic', size: 18 } },
                    { value: 0, widget: { type: 'icon', icon: 'audio-volume-muted-symbolic', size: 18 } },
                ]},
            ]
        }
    ]
});

const medialabel = player => ({
    type: 'mpris/box',
    player,
    className: `media ${player}`,
    children: [
        { type: 'mpris/player-icon', player, halign: 'start', size: 18 },
        ' ',
        { type: 'mpris/artist-label', className: 'artist', player },
        ' - ',
        { type: 'mpris/title-label', className: 'title', player },
    ]
});

Widget.widgets['media/panel-button'] = () => Widget({
    type: 'mpris/box',
    className: 'mpris',
    player: prefer('spotify'),
    children: [{
        type: 'button',
        onClick: () => App.toggleWindow('media'),
        onSecondaryClick: () => Mpris.getPlayer(prefer('spotify'))?.playPause(),
        onScrollUp: () => Mpris.getPlayer(prefer('spotify'))?.next(),
        onScrollDown: () => Mpris.getPlayer(prefer('spotify'))?.previous(),
        child: medialabel(prefer('spotify'))
    }],
});

Widget.widgets['media/popup-content'] = () => Widget({
    type: 'box',
    children: [
        mediabox('spotify', 'spotify'),
        mediabox('firefox', 'firefox'),
        mediabox('mpv', 'mpv'),
    ],
});
