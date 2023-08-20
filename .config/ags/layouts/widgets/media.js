import { HoverRevealer } from '../../modules/misc.js';
import * as mpris from '../../modules/mpris.js';
const { Box, CenterBox, Label } = ags.Widget;
const { Mpris } = ags.Service;
const { timeout } = ags.Utils;

export const MediaBox = ({ player = mpris.prefer, ...props }) => mpris.MprisBox({
    ...props,
    className: 'mediabox',
    player,
    children: [
        mpris.BlurredCoverArt({
            player,
            className: 'cover-art-bg',
            hexpand: true,
            children: [Box({
                className: 'shader',
                hexpand: true,
                vertical: true,
                children: [
                    Box({
                        children: [
                            mpris.CoverArt({
                                player,
                                className: 'cover-art',
                                halign: 'end',
                                hexpand: false,
                            }),
                            Box({
                                hexpand: true,
                                vertical: true,
                                className: 'labels',
                                children: [
                                    mpris.TitleLabel({
                                        player,
                                        className: 'title',
                                        xalign: 0,
                                        justification: 'left',
                                        wrap: true,
                                    }),
                                    mpris.ArtistLabel({
                                        player,
                                        className: 'artist',
                                        xalign: 0,
                                        justification: 'left',
                                        wrap: true,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    mpris.PositionSlider({
                        className: 'position-slider',
                        player,
                    }),
                    CenterBox({
                        className: 'footer-box',
                        children: [
                            Box({
                                children: [
                                    mpris.PositionLabel({ player }),
                                    mpris.Slash({ player }),
                                    mpris.LengthLabel({ player }),
                                ],
                            }),
                            Box({
                                className: 'controls',
                                children: [
                                    mpris.ShuffleButton({ player }),
                                    mpris.PreviousButton({ player }),
                                    mpris.PlayPauseButton({ player }),
                                    mpris.NextButton({ player }),
                                    mpris.LoopButton({ player }),
                                ],
                            }),
                            mpris.PlayerIcon({
                                player,
                                hexpand: true,
                                halign: 'end',
                            }),
                        ],
                    }),
                ],
            })],
        }),
    ],
});

export const PopupContent = props => Box({
    vertical: true,
    className: 'media',
    ...props,
    properties: [['players', new Map()]],
    connections: [
        [Mpris, (box, busName) => {
            if (!busName || box._players.has(busName))
                return;

            const widget = MediaBox({ player: busName });
            box._players.set(busName, widget);
            box.add(widget);
            widget.show();
        }, 'player-added'],
    ],
});

export const PanelIndicator = ({
    player = mpris.prefer,
    direction = 'left',
    onPrimaryClick = () => Mpris.getPlayer(player)?.playPause(),
    ...props
} = {}) => mpris.MprisBox({
    ...props,
    className: 'media panel-button',
    player,
    children: [HoverRevealer({
        direction,
        onPrimaryClick,
        onScrollUp: () => Mpris.getPlayer(player)?.next(),
        onScrollDown: () => Mpris.getPlayer(player)?.previous(),
        onSecondaryClick: () => Mpris.getPlayer(player)?.playPause(),
        indicator: mpris.PlayerIcon({
            player,
            className: 'icon',
            symbolic: true,
        }),
        child: Box({
            children: [
                mpris.ArtistLabel({ player }),
                Label(' - '),
                mpris.TitleLabel({ player }),
            ],
        }),
        connections: [[Mpris, revealer => {
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
        }]],
    })],
});
