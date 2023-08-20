const { CACHE_DIR, execAsync, ensureDirectory, lookUpIcon } = ags.Utils;
const { Button, Icon, Label, Box, Stack, Slider } = ags.Widget;
const { Mpris } = ags.Service;
const { GLib } = imports.gi;

const MEDIA_CACHE_PATH = CACHE_DIR + '/media';

export const prefer = players => {
    const preferred = 'spotify';
    let last;
    for (const [name, mpris] of players) {
        if (name.includes(preferred))
            return mpris;

        last = mpris;
    }

    return last;
};

export const MprisBox = ({ player = prefer, ...props } = {}) => Box({
    ...props,
    connections: [[Mpris, box => {
        const mpris = Mpris.getPlayer(player);
        box.visible = mpris;

        if (!mpris)
            return;

        if (box._current)
            box.toggleClassName(box._current, false);

        box._current = mpris.name;
        box.toggleClassName(mpris.name);
    }]],
    setup: box => {
        const id = box.connect('draw', () => {
            box.visible = Mpris.getPlayer(player);
            box.disconnect(id);
        });
    },
});

export const CoverArt = ({ player = prefer, ...props } = {}) => Box({
    ...props,
    connections: [[Mpris, box => {
        const url = Mpris.getPlayer(player)?.coverPath;
        if (!url)
            return;

        box.setStyle(`background-image: url("${url}")`);
    }]],
});

export const BlurredCoverArt = ({ player = prefer, ...props } = {}) => Box({
    ...props,
    connections: [[Mpris, box => {
        const url = Mpris.getPlayer(player)?.coverPath;
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

export const TitleLabel = ({ player = prefer, ...props } = {}) => Label({
    ...props,
    className: 'title',
    connections: [[Mpris, label => {
        label.label = Mpris.getPlayer(player)?.trackTitle || '';
    }]],
});

export const ArtistLabel = ({ player = prefer, ...props } = {}) => Label({
    ...props,
    className: 'artist',
    connections: [[Mpris, label => {
        label.label = Mpris.getPlayer(player)?.trackArtists.join(', ') || '';
    }]],
});

export const PlayerLabel = ({ player = prefer, ...props } = {}) => Label({
    ...props,
    connections: [[Mpris, label => {
        label.label = Mpris.getPlayer(player)?.identity || '';
    }]],
});

export const PlayerIcon = ({ symbolic = false, player = prefer, ...props } = {}) => Icon({
    ...props,
    connections: [[Mpris, icon => {
        const name = `${Mpris.getPlayer(player)?.entry}${symbolic ? '-symbolic' : ''}`;
        lookUpIcon(name)
            ? icon.icon_name = name
            : icon.icon_name = 'audio-x-generic-symbolic';
    }]],
});

export const VolumeSlider = ({ player = prefer, ...props } = {}) => Slider({
    ...props,
    drawValue: false,
    onChange: ({ value }) => {
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
            slider.value = mpris.volume;
        }
    }]],
});

export const VolumeIcon = ({ player = prefer, items } = {}) => Stack({
    items: items || [
        ['67', Icon('audio-volume-high-symbolic')],
        ['34', Icon('audio-volume-medium-symbolic')],
        ['1', Icon('audio-volume-low-symbolic')],
        ['0', Icon('audio-volume-muted-symbolic')],
    ],
    connections: [[Mpris, stack => {
        const mpris = Mpris.getPlayer(player);
        stack.visible = mpris?.volume >= 0;
        const value = (mpris?.volume || 0) * 100;
        if (66 <= value)
            stack.shown = '67';

        if (34 <= value)
            stack.shown = '34';

        if (1 <= value)
            stack.shown = '1';

        stack.shown = '0';
    }]],
});

export const PositionSlider = ({ player = prefer, ...props } = {}) => {
    const update = slider => {
        if (slider._dragging)
            return;

        const mpris = Mpris.getPlayer(player);
        slider.visible = mpris?.length > 0;
        if (mpris && mpris.length > 0)
            slider.adjustment.value = mpris.position / mpris.length;
    };
    return Slider({
        ...props,
        drawValue: false,
        onChange: ({ adjustment: { value } }) => {
            const mpris = Mpris.getPlayer(player);
            if (mpris && mpris.length >= 0)
                Mpris.getPlayer(player).position = mpris.length * value;
        },
        connections: [
            [Mpris, update],
            [1000, update],
        ],
    });
};

function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec0 = Math.floor(length % 60) < 10 ? '0' : '';
    const sec = Math.floor(length % 60);
    return `${min}:${sec0}${sec}`;
}

export const PositionLabel = ({ player = prefer, ...props } = {}) => {
    const update = label => {
        const mpris = Mpris.getPlayer(player);

        if (mpris && !label._binding) {
            label._binding = mpris.connect('position', (_, time) => {
                label.label = lengthStr(time);
            });
            label.connect('destroy', () => {
                if (mpris)
                    mpris.disconnect(label._binding);

                label._binding = null;
            });
        }

        mpris && mpris.length > 0
            ? label.label = lengthStr(mpris.position)
            : label.visible = mpris;

        return true;
    };
    return Label({
        ...props,
        connections: [
            [Mpris, update],
            [1000, update],
        ],
    });
};

export const LengthLabel = ({ player = prefer, ...props } = {}) => Label({
    ...props,
    connections: [[Mpris, label => {
        const mpris = Mpris.getPlayer(player);
        mpris && mpris.length > 0
            ? label.label = lengthStr(mpris.length)
            : label.visible = mpris;
    }]],
});

export const Slash = ({ player = prefer, ...props } = {}) => Label({
    ...props,
    label: '/',
    className: 'slash',
    connections: [
        [Mpris, label => {
            const mpris = Mpris.getPlayer(player);
            label.visible = mpris && mpris.length > 0;
        }],
    ],
});

const PlayerButton = ({
    player = prefer,
    items,
    onClick,
    prop,
    canProp,
    cantValue,
    ...rest
} = {}) => Button({
    ...rest,
    child: Stack({ items }),
    onClicked: () => Mpris.getPlayer(player)?.[onClick](),
    connections: [[Mpris, button => {
        const mpris = Mpris.getPlayer(player);
        if (!mpris || mpris[canProp] === cantValue)
            return button.hide();

        button.show();
        button.child.shown = `${mpris[prop]}`;
    }]],
});

export const ShuffleButton = ({
    player,
    enabled = Label({ className: 'shuffle enabled', label: '󰒟' }),
    disabled = Label({ className: 'shuffle disabled', label: '󰒟' }),
    ...props
} = {}) => PlayerButton({
    ...props,
    player,
    items: [
        ['true', enabled],
        ['false', disabled],
    ],
    onClick: 'shuffle',
    prop: 'shuffleStatus',
    canProp: 'shuffleStatus',
    cantValue: null,
});

export const LoopButton = ({
    player,
    none = Label({ className: 'loop none', label: '󰓦' }),
    track = Label({ className: 'loop track', label: '󰓦' }),
    playlist = Label({ className: 'loop playlist', label: '󰑐' }),
    ...props
} = {}) => PlayerButton({
    ...props,
    player,
    items: [
        ['None', none],
        ['Track', track],
        ['Playlist', playlist],
    ],
    onClick: 'loop',
    prop: 'loopStatus',
    canProp: 'loopStatus',
    cantValue: null,
});

export const PlayPauseButton = ({
    player,
    playing = Label({ className: 'playing', label: '󰏦' }),
    paused = Label({ className: 'paused', label: '󰐍' }),
    stopped = Label({ className: 'stopped', label: '󰐍' }),
    ...props
} = {}) => PlayerButton({
    ...props,
    player,
    items: [
        ['Playing', playing],
        ['Paused', paused],
        ['Stopped', stopped],
    ],
    onClick: 'playPause',
    prop: 'playBackStatus',
    canProp: 'canPlay',
    cantValue: false,
});

export const PreviousButton = ({
    player,
    child = Label({ className: 'previous', label: '󰒮' }),
    ...props
} = {}) => PlayerButton({
    ...props,
    player,
    items: [
        ['true', child],
    ],
    onClick: 'previous',
    prop: 'canGoPrev',
    canProp: 'canGoPrev',
    cantValue: false,
});

export const NextButton = ({
    player,
    child = Label({ className: 'next', label: '󰒭' }),
    ...props
} = {}) => PlayerButton({
    ...props,
    player,
    items: [
        ['true', child],
    ],
    onClick: 'next',
    prop: 'canGoNext',
    canProp: 'canGoNext',
    cantValue: false,
});
