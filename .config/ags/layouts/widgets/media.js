const { Widget } = ags;
const { Mpris } = ags.Service;
const { timeout } = ags.Utils;
const { prefer } = imports.modules.mpris;

Widget.widgets['mediabox'] = ({ player = prefer, ...props }) => Widget({
    ...props,
    type: 'mpris/box',
    player,
    children: [
        {
            type: 'mpris/blurred-cover-art',
            player,
            className: 'cover-art-bg',
            hexpand: true,
            children: [{
                type: 'box',
                className: 'shader',
                hexpand: true,
                orientation: 'vertical',
                children: [
                    {
                        type: 'box',
                        children: [
                            {
                                type: 'mpris/cover-art', player,
                                className: 'cover-art',
                                halign: 'end',
                                hexpand: false,
                            },
                            {
                                type: 'box',
                                hexpand: true,
                                orientation: 'vertical',
                                className: 'labels',
                                children: [
                                    {
                                        type: 'mpris/title-label', player,
                                        className: 'title',
                                        xalign: 0,
                                        justify: 'left',
                                        wrap: true,
                                    },
                                    {
                                        type: 'mpris/artist-label', player,
                                        className: 'artist',
                                        xalign: 0,
                                        justify: 'left',
                                        wrap: true,
                                    },
                                ],
                            },
                        ],
                    },
                    { type: 'mpris/position-slider', className: 'position-slider', player },
                    {
                        type: 'centerbox',
                        className: 'footer-box',
                        children: [
                            {
                                type: 'box',
                                children: [
                                    { type: 'mpris/position-label', player },
                                    { type: 'mpris/slash', player },
                                    { type: 'mpris/length-label', player },
                                ],
                            },
                            {
                                className: 'controls',
                                type: 'box',
                                children: [
                                    { type: 'mpris/shuffle-button', player },
                                    { type: 'mpris/previous-button', player },
                                    { type: 'mpris/play-pause-button', player },
                                    { type: 'mpris/next-button', player },
                                    { type: 'mpris/loop-button', player },
                                ],
                            },
                            {
                                type: 'mpris/player-icon', player,
                                hexpand: true,
                                halign: 'end',
                            },
                        ],
                    },
                ],
            }],
        },
    ],
});

Widget.widgets['media/popup-content'] = props => Widget({
    ...props,
    type: 'box',
    children: [
        { type: 'mediabox', player: 'spotify', className: 'mediabox spotify' },
        { type: 'mediabox', player: 'firefox', className: 'mediabox firefox' },
        { type: 'mediabox', player: 'mpv', className: 'mediabox mpv' },
    ],
});

Widget.widgets['media/panel-indicator'] = ({
    player = prefer,
    direction = 'left',
    onClick = () => Mpris.getPlayer(player)?.playPause(),
    ...props
}) => Widget({
    ...props,
    type: 'mpris/box',
    player,
    children: [{
        type: 'hover-revealer',
        direction,
        onClick,
        onScrollUp: () => Mpris.getPlayer(player)?.next(),
        onScrollDown: () => Mpris.getPlayer(player)?.previous(),
        onSecondaryClick: () => Mpris.getPlayer(player)?.playPause(),
        indicator: { type: 'mpris/player-icon', player },
        child: {
            type: 'box',
            children: [
                { type: 'mpris/artist-label', className: 'artist', player },
                ' - ',
                { type: 'mpris/title-label', className: 'title', player },
            ],
        },
        connection: [Mpris, revealer => {
            const mpris = Mpris.getPlayer(player);
            if (!mpris)
                return;

            if (revealer._current === mpris.trackTitle)
                return;

            revealer._current = mpris.trackTitle;
            revealer.reveal_child = true;
            timeout(3000, () => {
                revealer.reveal_child = false;
            });
        }],
    }],
});
