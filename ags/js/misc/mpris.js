import icons from '../icons.js';
import { Utils, Widget } from '../imports.js';
import GLib from 'gi://GLib';

const MEDIA_CACHE_PATH = Utils.CACHE_DIR + '/media';

export const CoverArt = (player, props) => Widget.Box({
    ...props,
    className: 'cover',
    binds: [['style', player, 'cover-path',
        path => `background-image: url("${path}")`]],
});

export const BlurredCoverArt = (player, props) => Widget.Box({
    ...props,
    className: 'blurred-cover',
    connections: [[player, box => {
        const url = player.coverPath;
        if (!url)
            return;

        const blurredPath = MEDIA_CACHE_PATH + '/blurred';
        const blurred = blurredPath +
            url.substring(MEDIA_CACHE_PATH.length);

        if (GLib.file_test(blurred, GLib.FileTest.EXISTS)) {
            box.setStyle(`background-image: url("${blurred}")`);
            return;
        }

        Utils.ensureDirectory(blurredPath);
        Utils.execAsync(['convert', url, '-blur', '0x22', blurred])
            .then(() => box.setStyle(`background-image: url("${blurred}")`))
            .catch(() => { });
    }, 'notify::cover-path']],
});

export const TitleLabel = (player, props) => Widget.Label({
    ...props,
    className: 'title',
    binds: [['label', player, 'track-title']],
});

export const ArtistLabel = (player, props) => Widget.Label({
    ...props,
    className: 'artist',
    binds: [['label', player, 'track-artists', a => a.join(', ') || '']],
});

export const PlayerIcon = (player, { symbolic = true, ...props } = {}) => Widget.Icon({
    ...props,
    className: 'player-icon',
    tooltipText: player.identity || '',
    connections: [[player, icon => {
        const name = `${player.entry}${symbolic ? '-symbolic' : ''}`;
        Utils.lookUpIcon(name)
            ? icon.icon = name
            : icon.icon = icons.mpris.fallback;
    }]],
});

export const PositionSlider = (player, props) => Widget.Slider({
    ...props,
    className: 'position-slider',
    drawValue: false,
    onChange: ({ value }) => {
        player.position = player.length * value;
    },
    properties: [['update', slider => {
        if (slider.dragging)
            return;

        slider.visible = player.length > 0;
        if (player.length > 0)
            slider.value = player.position / player.length;
    }]],
    connections: [
        [player, s => s._update(s)],
        [player, s => s._update(s), 'position'],
        [1000, s => s._update(s)],
    ],
});

function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? '0' : '';
    return `${min}:${sec0}${sec}`;
}

export const PositionLabel = player => Widget.Label({
    properties: [['update', (label, time) => {
        player.length > 0
            ? label.label = lengthStr(time || player.position)
            : label.visible = !!player;
    }]],
    connections: [
        [player, (l, time) => l._update(l, time), 'position'],
        [1000, l => l._update(l)],
    ],
});

export const LengthLabel = player => Widget.Label({
    connections: [[player, label => {
        player.length > 0
            ? label.label = lengthStr(player.length)
            : label.visible = !!player;
    }]],
});

export const Slash = player => Widget.Label({
    label: '/',
    connections: [[player, label => {
        label.visible = player.length > 0;
    }]],
});

const PlayerButton = ({ player, items, onClick, prop, canProp, cantValue }) => Widget.Button({
    child: Widget.Stack({
        items,
        binds: [['shown', player, prop, p => `${p}`]],
    }),
    onClicked: player[onClick].bind(player),
    binds: [['visible', player, canProp, c => c !== cantValue]],
});

export const ShuffleButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Label({
            className: 'shuffle enabled',
            label: icons.mpris.shuffle.enabled,
        })],
        ['false', Widget.Label({
            className: 'shuffle disabled',
            label: icons.mpris.shuffle.disabled,
        })],
    ],
    onClick: 'shuffle',
    prop: 'shuffle-status',
    canProp: 'shuffle-status',
    cantValue: null,
});

export const LoopButton = player => PlayerButton({
    player,
    items: [
        ['None', Widget.Label({
            className: 'loop none',
            label: icons.mpris.loop.none,
        })],
        ['Track', Widget.Label({
            className: 'loop track',
            label: icons.mpris.loop.track,
        })],
        ['Playlist', Widget.Label({
            className: 'loop playlist',
            label: icons.mpris.loop.playlist,
        })],
    ],
    onClick: 'loop',
    prop: 'loop-status',
    canProp: 'loop-status',
    cantValue: null,
});

export const PlayPauseButton = player => PlayerButton({
    player,
    items: [
        ['Playing', Widget.Label({
            className: 'playing',
            label: icons.mpris.playing,
        })],
        ['Paused', Widget.Label({
            className: 'paused',
            label: icons.mpris.paused,
        })],
        ['Stopped', Widget.Label({
            className: 'stopped',
            label: icons.mpris.stopped,
        })],
    ],
    onClick: 'playPause',
    prop: 'play-back-status',
    canProp: 'can-play',
    cantValue: false,
});

export const PreviousButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Label({
            className: 'previous',
            label: icons.mpris.prev,
        })],
    ],
    onClick: 'previous',
    prop: 'can-go-prev',
    canProp: 'can-go-prev',
    cantValue: false,
});

export const NextButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Label({
            className: 'next',
            label: icons.mpris.next,
        })],
    ],
    onClick: 'next',
    prop: 'can-go-next',
    canProp: 'can-go-next',
    cantValue: false,
});
