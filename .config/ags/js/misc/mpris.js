import icons from '../icons.js';
const { CACHE_DIR, execAsync, ensureDirectory, lookUpIcon } = ags.Utils;
const { Button, Icon, Label, Box, Stack, Slider } = ags.Widget;
const { GLib } = imports.gi;

const MEDIA_CACHE_PATH = CACHE_DIR + '/media';

export const CoverArt = (player, props) => Box({
    ...props,
    className: 'cover',
    connections: [[player, box => {
        box.setStyle(`background-image: url("${player.coverPath}")`);
    }]],
});

export const BlurredCoverArt = (player, props) => Box({
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

        ensureDirectory(blurredPath);
        execAsync(['convert', url, '-blur', '0x22', blurred])
            .then(() => box.setStyle(`background-image: url("${blurred}")`))
            .catch(() => { });
    }]],
});

export const TitleLabel = (player, props) => Label({
    ...props,
    className: 'title',
    binds: [['label', player, 'trackTitle']],
});

export const ArtistLabel = (player, props) => Label({
    ...props,
    className: 'artist',
    connections: [[player, label => {
        label.label = player.trackArtists.join(', ') || '';
    }]],
});

export const PlayerIcon = (player, { symbolic = true, ...props } = {}) => Icon({
    ...props,
    className: 'player-icon',
    tooltipText: player.indentity || '',
    connections: [[player, icon => {
        const name = `${player.entry}${symbolic ? '-symbolic' : ''}`;
        lookUpIcon(name)
            ? icon.icon = name
            : icon.icon = icons.mpris.fallback;
    }]],
});

export const PositionSlider = (player, props) => Slider({
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
        [player, s => s._update(s), 'position'],
        [1000, s => s._update(s)],
    ],
});

function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec0 = Math.floor(length % 60) < 10 ? '0' : '';
    const sec = Math.floor(length % 60);
    return `${min}:${sec0}${sec}`;
}

export const PositionLabel = player => Label({
    properties: [['update', label => {
        player.length > 0
            ? label.label = lengthStr(player.position)
            : label.visible = !!player;
    }]],
    connections: [
        [player, l => l._update(l), 'position'],
        [1000, l => l._update(l)],
    ],
});

export const LengthLabel = player => Label({
    connections: [[player, label => {
        player.length > 0
            ? label.label = lengthStr(player.length)
            : label.visible = !!player;
    }]],
});

export const Slash = player => Label({
    label: '/',
    connections: [[player, label => {
        label.visible = player.length > 0;
    }]],
});

const PlayerButton = ({ player, items, onClick, prop, canProp, cantValue }) => Button({
    child: Stack({ items }),
    onClicked: () => player[onClick](),
    connections: [[player, button => {
        button.visible = player[canProp] !== cantValue;
        button.child.shown = `${player[prop]}`;
    }]],
});

export const ShuffleButton = player => PlayerButton({
    player,
    items: [
        ['true', Label({
            className: 'shuffle enabled',
            label: icons.mpris.shuffle.enabled,
        })],
        ['false', Label({
            className: 'shuffle disabled',
            label: icons.mpris.shuffle.disabled,
        })],
    ],
    onClick: 'shuffle',
    prop: 'shuffleStatus',
    canProp: 'shuffleStatus',
    cantValue: null,
});

export const LoopButton = player => PlayerButton({
    player,
    items: [
        ['None', Label({
            className: 'loop none',
            label: icons.mpris.loop.none,
        })],
        ['Track', Label({
            className: 'loop track',
            label: icons.mpris.loop.track,
        })],
        ['Playlist', Label({
            className: 'loop playlist',
            label: icons.mpris.loop.playlist,
        })],
    ],
    onClick: 'loop',
    prop: 'loopStatus',
    canProp: 'loopStatus',
    cantValue: null,
});

export const PlayPauseButton = player => PlayerButton({
    player,
    items: [
        ['Playing', Label({
            className: 'playing',
            label: icons.mpris.playing,
        })],
        ['Paused', Label({
            className: 'paused',
            label: icons.mpris.paused,
        })],
        ['Stopped', Label({
            className: 'stopped',
            label: icons.mpris.stopped,
        })],
    ],
    onClick: 'playPause',
    prop: 'playBackStatus',
    canProp: 'canPlay',
    cantValue: false,
});

export const PreviousButton = player => PlayerButton({
    player,
    items: [
        ['true', Label({
            className: 'previous',
            label: icons.mpris.prev,
        })],
    ],
    onClick: 'previous',
    prop: 'canGoPrev',
    canProp: 'canGoPrev',
    cantValue: false,
});

export const NextButton = player => PlayerButton({
    player,
    items: [
        ['true', Label({
            className: 'next',
            label: icons.mpris.next,
        })],
    ],
    onClick: 'next',
    prop: 'canGoNext',
    canProp: 'canGoNext',
    cantValue: false,
});
