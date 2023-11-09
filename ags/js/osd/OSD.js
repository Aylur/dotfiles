import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import FontIcon from '../misc/FontIcon.js';
import Progress from '../misc/Progress.js';
import Indicator from '../services/onScreenIndicator.js';

export const OnScreenIndicator = ({ height = 300, width = 48 } = {}) => Widget.Box({
    class_name: 'indicator',
    css: 'padding: 1px;',
    child: Widget.Revealer({
        transition: 'slide_left',
        connections: [[Indicator, (revealer, value) => {
            revealer.reveal_child = value > -1;
        }]],
        child: Progress({
            width,
            height,
            vertical: true,
            connections: [[Indicator, (progress, value) => progress.setValue(value)]],
            child: Widget.Stack({
                vpack: 'start',
                hpack: 'center',
                hexpand: false,
                items: [
                    ['true', Widget.Icon({
                        hpack: 'center',
                        size: width,
                        connections: [[Indicator, (icon, _v, name) => icon.icon = name || '']],
                    })],
                    ['false', FontIcon({
                        hpack: 'center',
                        hexpand: true,
                        css: `font-size: ${width}px;`,
                        connections: [[Indicator, (icon, _v, name) => icon.icon = name || '']],
                    })],
                ],
                connections: [[Indicator, (stack, _v, name) => {
                    stack.shown = `${!!Utils.lookUpIcon(name)}`;
                }]],
            }),
        }),
    }),
});

/** @param {number} monitor */
export default monitor => Widget.Window({
    name: `indicator${monitor}`,
    monitor,
    class_name: 'indicator',
    layer: 'overlay',
    anchor: ['right'],
    child: OnScreenIndicator(),
});
