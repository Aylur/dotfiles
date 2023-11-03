import * as mpris from '../../misc/mpris.js';
import { Mpris, Widget } from '../../imports.js';

const blackList = ['Caprine'];

const Footer = player => Widget.CenterBox({
    class_name: 'footer-box',
    children: [
        Widget.Box({
            class_name: 'position',
            children: [
                mpris.PositionLabel(player),
                mpris.Slash(player),
                mpris.LengthLabel(player),
            ],
        }),
        Widget.Box({
            class_name: 'controls',
            children: [
                mpris.ShuffleButton(player),
                mpris.PreviousButton(player),
                mpris.PlayPauseButton(player),
                mpris.NextButton(player),
                mpris.LoopButton(player),
            ],
        }),
        mpris.PlayerIcon(player, {
            symbolic: false,
            hexpand: true,
            hpack: 'end',
        }),
    ],
});

const TextBox = player => Widget.Box({
    children: [
        mpris.CoverArt(player, {
            hpack: 'end',
            hexpand: false,
            child: Widget.Box({
                class_name: 'shader',
                hexpand: true,
            }),
        }),
        Widget.Box({
            hexpand: true,
            vertical: true,
            class_name: 'labels',
            children: [
                mpris.TitleLabel(player, {
                    xalign: 0,
                    justification: 'left',
                    wrap: true,
                }),
                mpris.ArtistLabel(player, {
                    xalign: 0,
                    justification: 'left',
                    wrap: true,
                }),
            ],
        }),
    ],
});

const PlayerBox = player => Widget.Box({
    class_name: `player ${player.name}`,
    child: mpris.BlurredCoverArt(player, {
        class_name: 'cover-art-bg',
        hexpand: true,
        child: Widget.Box({
            class_name: 'shader',
            hexpand: true,
            vertical: true,
            children: [
                TextBox(player),
                mpris.PositionSlider(player),
                Footer(player),
            ],
        }),
    }),
});

export default () => Widget.Box({
    vertical: true,
    class_name: 'media',
    binds: [['children', Mpris, 'players', ps =>
        ps.filter(p => !blackList.includes(p.identity)).map(PlayerBox)]],
});
