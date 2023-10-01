import { Utils, Widget } from '../imports.js';
import FontIcon from '../misc/FontIcon.js';
import Progress from '../misc/Progress.js';
import Indicator from '../services/onScreenIndicator.js';

export const OnScreenIndicator = ({ height = 300, width = 48 } = {}) => Widget.Box({
    className: 'indicator',
    style: 'padding: 1px;',
    children: [Widget.Revealer({
        transition: 'slide_left',
        connections: [[Indicator, (revealer, value) => {
            revealer.revealChild = value > -1;
        }]],
        child: Progress({
            width,
            height,
            vertical: true,
            connections: [[Indicator, (progress, value) => progress.setValue(value)]],
            child: Widget.Stack({
                valign: 'start',
                halign: 'center',
                hexpand: false,
                items: [
                    ['true', Widget.Icon({
                        halign: 'center',
                        size: width,
                        connections: [[Indicator, (icon, _v, name) => icon.icon = name || '']],
                    })],
                    ['false', FontIcon({
                        halign: 'center',
                        hexpand: true,
                        style: `font-size: ${width}px;`,
                        connections: [[Indicator, (icon, _v, name) => icon.icon = name || '']],
                    })],
                ],
                connections: [[Indicator, (stack, _v, name) => {
                    stack.shown = `${!!Utils.lookUpIcon(name)}`;
                }]],
            }),
        }),
    })],
});

export default monitor => Widget.Window({
    name: `indicator${monitor}`,
    monitor,
    className: 'indicator',
    layer: 'overlay',
    anchor: ['right'],
    child: OnScreenIndicator(),
});
