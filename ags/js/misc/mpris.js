import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import icons from '../icons.js';
import { blurImg } from '../utils.js';

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 * @param {import('types/widgets/box').BoxProps=} props
 */
export const CoverArt = (player, props) => Widget.Box({
    ...props,
    class_name: 'cover',
    binds: [['css', player, 'cover-path',
        path => `background-image: url("${path}")`]],
});

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 * @param {import('types/widgets/box').BoxProps=} props
 */
export const BlurredCoverArt = (player, props) => Widget.Box({
    ...props,
    class_name: 'blurred-cover',
    connections: [[player, box => blurImg(player.cover_path).then(img => {
        img && box.setCss(`background-image: url("${img}")`);
    }), 'notify::cover-path']],
});

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 * @param {import('types/widgets/label').Props=} props
 */
export const TitleLabel = (player, props) => Widget.Label({
    ...props,
    class_name: 'title',
    binds: [['label', player, 'track-title']],
});

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 * @param {import('types/widgets/label').Props=} props
 */
export const ArtistLabel = (player, props) => Widget.Label({
    ...props,
    class_name: 'artist',
    binds: [['label', player, 'track-artists', a => a.join(', ') || '']],
});

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 * @param {import('types/widgets/icon').Props & { symbolic?: boolean }=} props
 */
export const PlayerIcon = (player, { symbolic = true, ...props } = {}) => Widget.Icon({
    ...props,
    class_name: 'player-icon',
    tooltip_text: player.identity || '',
    connections: [[player, icon => {
        const name = `${player.entry}${symbolic ? '-symbolic' : ''}`;
        Utils.lookUpIcon(name)
            ? icon.icon = name
            : icon.icon = icons.mpris.fallback;
    }]],
});

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 * @param {import('types/widgets/slider').SliderProps=} props
 */
export const PositionSlider = (player, props) => Widget.Slider({
    ...props,
    class_name: 'position-slider',
    draw_value: false,
    on_change: ({ value }) => {
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

/** @param {number} length */
function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? '0' : '';
    return `${min}:${sec0}${sec}`;
}

/** @param {import('types/service/mpris').MprisPlayer} player */
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

/** @param {import('types/service/mpris').MprisPlayer} player */
export const LengthLabel = player => Widget.Label({
    connections: [[player, label => {
        player.length > 0
            ? label.label = lengthStr(player.length)
            : label.visible = !!player;
    }]],
});

/** @param {import('types/service/mpris').MprisPlayer} player */
export const Slash = player => Widget.Label({
    label: '/',
    connections: [[player, label => {
        label.visible = player.length > 0;
    }]],
});

/**
 * @param {Object} o
 * @param {import('types/service/mpris').MprisPlayer} o.player
 * @param {import('types/widgets/stack').StackProps['items']} o.items
 * @param {'shuffle' | 'loop' | 'playPause' | 'previous' | 'next'} o.onClick
 * @param {string} o.prop
 * @param {string} o.canProp
 * @param {any} o.cantValue
 */
const PlayerButton = ({ player, items, onClick, prop, canProp, cantValue }) => Widget.Button({
    child: Widget.Stack({
        items,
        binds: [['shown', player, prop, p => `${p}`]],
    }),
    on_clicked: player[onClick].bind(player),
    binds: [['visible', player, canProp, c => c !== cantValue]],
});

/** @param {import('types/service/mpris').MprisPlayer} player */
export const ShuffleButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Label({
            class_name: 'shuffle enabled',
            label: icons.mpris.shuffle.enabled,
        })],
        ['false', Widget.Label({
            class_name: 'shuffle disabled',
            label: icons.mpris.shuffle.disabled,
        })],
    ],
    onClick: 'shuffle',
    prop: 'shuffle-status',
    canProp: 'shuffle-status',
    cantValue: null,
});

/** @param {import('types/service/mpris').MprisPlayer} player */
export const LoopButton = player => PlayerButton({
    player,
    items: [
        ['None', Widget.Label({
            class_name: 'loop none',
            label: icons.mpris.loop.none,
        })],
        ['Track', Widget.Label({
            class_name: 'loop track',
            label: icons.mpris.loop.track,
        })],
        ['Playlist', Widget.Label({
            class_name: 'loop playlist',
            label: icons.mpris.loop.playlist,
        })],
    ],
    onClick: 'loop',
    prop: 'loop-status',
    canProp: 'loop-status',
    cantValue: null,
});

/** @param {import('types/service/mpris').MprisPlayer} player */
export const PlayPauseButton = player => PlayerButton({
    player,
    items: [
        ['Playing', Widget.Label({
            class_name: 'playing',
            label: icons.mpris.playing,
        })],
        ['Paused', Widget.Label({
            class_name: 'paused',
            label: icons.mpris.paused,
        })],
        ['Stopped', Widget.Label({
            class_name: 'stopped',
            label: icons.mpris.stopped,
        })],
    ],
    onClick: 'playPause',
    prop: 'play-back-status',
    canProp: 'can-play',
    cantValue: false,
});

/** @param {import('types/service/mpris').MprisPlayer} player */
export const PreviousButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Label({
            class_name: 'previous',
            label: icons.mpris.prev,
        })],
    ],
    onClick: 'previous',
    prop: 'can-go-prev',
    canProp: 'can-go-prev',
    cantValue: false,
});

/** @param {import('types/service/mpris').MprisPlayer} player */
export const NextButton = player => PlayerButton({
    player,
    items: [
        ['true', Widget.Label({
            class_name: 'next',
            label: icons.mpris.next,
        })],
    ],
    onClick: 'next',
    prop: 'can-go-next',
    canProp: 'can-go-next',
    cantValue: false,
});
