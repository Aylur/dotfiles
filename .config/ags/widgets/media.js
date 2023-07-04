const { App, Widget } = ags;
const { Mpris } = ags.Service;
const { timeout } = ags.Utils;

var prefer = player => players => {
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
            label.visible = mpris && mpris.length > 0;
        }],
    ],
});

const mediabox = (player, className) => ({
    type: 'mpris/box', player,
    className: `mediabox ${className}`,
    children: [
        {
            type: 'mpris/cover-art', player,
            className: 'cover-art',
            hexpand: true,
            vexpand: true,
            children: [{
                type: 'box',
                className: 'shader',
                orientation: 'vertical',
                hexpand: true,
                children: [
                    {
                        className: 'header-box',
                        type: 'box',
                        orientation: 'vertical',
                        vexpand: true,
                        children: [
                            {
                                type: 'box',
                                children: [
                                    {
                                        type: 'mpris/title-label', player,
                                        className: 'title',
                                        xalign: 0,
                                        justify: 'left',
                                        wrap: true,
                                        maxWidth: 24,
                                    },
                                    {
                                        type: 'mpris/player-icon', player,
                                        className: 'player',
                                        hexpand: true,
                                        halign: 'end',
                                        valign: 'start',
                                        symbolic: true,
                                    },
                                ],
                            },
                            {
                                type: 'mpris/artist-label', player,
                                className: 'artist',
                                xalign: 0,
                            },
                        ],
                    },
                    { type: 'mpris/position-slider', className: 'position-slider', player },
                    {
                        className: 'footerbox',
                        type: 'box',
                        children: [
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
                                type: 'box',
                                className: 'length',
                                hexpand: true,
                                halign: 'end',
                                children: [
                                    { type: 'mpris/position-label', player },
                                    slash(player),
                                    { type: 'mpris/length-label', player },
                                ],
                            },
                        ],
                    },
                ],
            }],
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
                    vexpand: true,
                },
                { className: 'icon',
                    type: 'mpris/volume-icon', player, halign: 'center', items: [
                        { value: 67, widget: { type: 'icon', icon: 'audio-volume-high-symbolic', size: 18 } },
                        { value: 34, widget: { type: 'icon', icon: 'audio-volume-medium-symbolic', size: 18 } },
                        { value: 1, widget: { type: 'icon', icon: 'audio-volume-low-symbolic', size: 18 } },
                        { value: 0, widget: { type: 'icon', icon: 'audio-volume-muted-symbolic', size: 18 } },
                    ],
                },
            ],
        },
    ],
});

Widget.widgets['media/panel-button'] = ({ player = prefer('spotify') }) => Widget({
    type: 'mpris/box',
    className: 'mpris',
    player,
    children: [{
        type: 'button',
        onClick: () => App.toggleWindow('media'),
        onSecondaryClick: () => Mpris.getPlayer(player)?.playPause(),
        onScrollUp: () => Mpris.getPlayer(player)?.next(),
        onScrollDown: () => Mpris.getPlayer(player)?.previous(),
        child: {
            type: 'box',
            children: [
                { type: 'mpris/player-icon', player, halign: 'start', size: 18 },
                ' ',
                { type: 'mpris/artist-label', className: 'artist', player },
                ' - ',
                { type: 'mpris/title-label', className: 'title', player },
            ],
        },
    }],
});

Widget.widgets['media/popup-content'] = props => Widget({
    ...props,
    type: 'box',
    children: [
        mediabox('spotify', 'spotify'),
        mediabox('firefox', 'firefox'),
        mediabox('mpv', 'mpv'),
    ],
});

const icon = player => ({ type: 'mpris/player-icon', player });
const reaveler = player => ({
    type: 'revealer',
    transition: 'slide_left',
    child: {
        type: 'box',
        children: [
            { type: 'mpris/artist-label', className: 'artist', player },
            ' - ',
            { type: 'mpris/title-label', className: 'title', player },
        ],
    },
});


Widget.widgets['media/indicator'] = ({
    player = prefer('spotify'),
    direction = 'left',
    onClick = () => Mpris.getPlayer(player)?.playPause(),
    ...props
}) => Widget({
    ...props,
    type: 'mpris/box',
    player,
    children: [{
        type: 'eventbox',
        onHover: box => {
            timeout(200, () => box._revealed = true);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = true;
        },
        onHoverLost: box => {
            if (!box._revealed)
                return;

            timeout(200, () => box._revealed = false);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = false;
        },
        onClick,
        onSecondaryClick: () => Mpris.getPlayer(player)?.playPause(),
        onScrollUp: () => Mpris.getPlayer(player)?.next(),
        onScrollDown: () => Mpris.getPlayer(player)?.previous(),
        connections: [[Mpris, box => {
            const mpris = Mpris.getPlayer(player);
            if (!mpris)
                return;

            if (box._current === mpris.trackTitle)
                return;

            box._current = mpris.trackTitle;
            box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = true;
            timeout(5000, () => {
                box.get_child().get_children()[direction === 'left' ? 0 : 1].reveal_child = false;
            });
        }]],
        child: {
            type: 'box',
            children: direction === 'left'
                ? [reaveler(player), icon(player)]
                : [icon(player), reaveler(player)],
        },
    }],
});
