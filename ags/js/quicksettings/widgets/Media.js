import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as mpris from '../../misc/mpris.js';
import options from '../../options.js';

/** @param {import('types/service/mpris').MprisPlayer} player */
const Footer = player => Widget.CenterBox({
    class_name: 'footer-box',
    start_widget: Widget.Box({
        class_name: 'position',
        children: [
            mpris.PositionLabel(player),
            mpris.Slash(player),
            mpris.LengthLabel(player),
        ],
    }),
    center_widget: Widget.Box({
        class_name: 'controls',
        children: [
            mpris.ShuffleButton(player),
            mpris.PreviousButton(player),
            mpris.PlayPauseButton(player),
            mpris.NextButton(player),
            mpris.LoopButton(player),
        ],
    }),
    end_widget: mpris.PlayerIcon(player, {
        symbolic: false,
        hexpand: true,
        hpack: 'end',
    }),
});

/** @param {import('types/service/mpris').MprisPlayer} player */
const TextBox = player => Widget.Box({
    children: [
        mpris.CoverArt(player, {
            hpack: 'end',
            hexpand: false,
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

/** @param {import('types/service/mpris').MprisPlayer} player */
const PlayerBox = player => Widget.Box({
    class_name: `player ${player.name}`,
    child: mpris.BlurredCoverArt(player, {
        hexpand: true,
        child: Widget.Box({
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
    class_name: 'media vertical',
    visible: Mpris.bind('players').transform(p => p.length > 0),
    children: Mpris.bind('players').transform(ps => ps
        .filter(p => !options.mpris.black_list.value
            .includes(p.identity)).map(PlayerBox)),
});
