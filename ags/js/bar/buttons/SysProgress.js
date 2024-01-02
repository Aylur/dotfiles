import * as vars from '../../variables.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../../icons.js';

export default (type, title, unit) => Widget.Box({
    className: `system-resources-box ${type}`,
    hexpand: false,
    binds: [['tooltipText', vars[type], 'value', v =>
        `${title}: ${Math.floor(v * 100)}${unit}`]],
    child: Widget.CircularProgress({
        hexpand: true,
        inverted: false,
        className: `circular-progress ${type}`,
        binds: [['value', vars[type]]],
        startAt: 0.75,
        child: Widget.Icon(icons.system[type]),
    }),
});
