import * as mpris from '../../misc/mpris.js';
import { Mpris, Widget } from '../../imports.js';

const blackList = ['Caprine'];

const Footer = player => Widget.CenterBox({
    className: 'footer-box',
    children: [
        Widget.Box({
            className: 'position',
            children: [
                mpris.PositionLabel(player),
                mpris.Slash(player),
                mpris.LengthLabel(player),
            ],
        }),
        Widget.Box({
            className: 'controls',
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
            halign: 'end',
        }),
    ],
});

const TextBox = player => Widget.Box({
    children: [
        mpris.CoverArt(player, {
            halign: 'end',
            hexpand: false,
            child: Widget.Box({
                className: 'shader',
                hexpand: true,
            }),
        }),
        Widget.Box({
            hexpand: true,
            vertical: true,
            className: 'labels',
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
    className: `player ${player.name}`,
    children: [
        mpris.BlurredCoverArt(player, {
            className: 'cover-art-bg',
            hexpand: true,
            children: [Widget.Box({
                className: 'shader',
                hexpand: true,
                vertical: true,
                children: [
                    TextBox(player),
                    mpris.PositionSlider(player),
                    Footer(player),
                ],
            })],
        }),
    ],
});

export default () => Widget.Box({
    vertical: true,
    className: 'media',
    properties: [['players', new Map()]],
    connections: [
        [Mpris, (box, busName) => {
            if (!busName || box._players.has(busName))
                return;

            const player = Mpris.getPlayer(busName);
            if (blackList.includes(player.identity))
                return;

            box._players.set(busName, PlayerBox(player));
            box.children = Array.from(box._players.values());
        }, 'player-added'],
        [Mpris, (box, busName) => {
            if (!busName || !box._players.has(busName))
                return;

            box._players.delete(busName);
            box.children = Array.from(box._players.values());
        }, 'player-closed'],
    ],
});
