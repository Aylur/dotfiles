import HoverRevealer from '../../misc/HoverRevealer.js';
import * as mpris from '../../misc/mpris.js';
const { Box, Label } = ags.Widget;
const { Mpris } = ags.Service;

const Indicator = ({ player, direction = 'right' } = {}) => Box({
    className: `media panel-button ${player.name}`,
    children: [HoverRevealer({
        direction,
        onPrimaryClick: () => player.playPause(),
        onScrollUp: () => player.next(),
        onScrollDown: () => player.previous(),
        onSecondaryClick: () => player.playPause(),
        indicator: mpris.PlayerIcon(player),
        child: Label({
            truncate: 'end',
            maxWidthChars: 40,
            connections: [[player, label => {
                label.label = `${player.trackArtists[0]} - ${player.trackTitle}`;
            }]],
        }),
        connections: [[player, revealer => {
            if (revealer._current === player.trackTitle)
                return;

            revealer._current = player.trackTitle;
            revealer.revealChild = true;
            ags.Utils.timeout(3000, () => {
                revealer.revealChild = false;
            });
        }]],
    })],
});

export default ({ direction } = {}) => Box({
    connections: [[Mpris, box => {
        const player = Mpris.getPlayer(mpris.prefer);
        if (!player) {
            box._player = null;
            return;
        }
        if (box._player === player)
            return;

        box.visible = true;
        box._player = player;
        box.children = [Indicator({ player, direction })];
    }]],
});
