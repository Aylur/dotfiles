const { Widget } = ags;
const { Battery } = ags.Service;

function _default(charging) {
    const items = [];
    for (let i = 0; i <= 90; i += 10) {
        items.push({
            value: i,
            widget: {
                type: 'icon',
                className: `${i} ${charging ? 'charging' : 'discharging'}`,
                icon: `battery-level-${i}${charging ? '-charging' : ''}-symbolic`,
            },
        });
    }
    items.push({
        value: 100,
        widget: {
            type: 'icon',
            className: `100 ${charging ? 'charging' : 'discharging'}`,
            icon: `battery-level-100${charging ? '-charged' : ''}-symbolic`,
        },
    });
    return items.reverse();
}

const _indicators = items => Widget({
    type: 'dynamic',
    items,
    connections: [[Battery, dynamic => {
        dynamic.update(value => Battery.percent >= value);
    }]],
});

Widget.widgets['battery/indicator'] = ({
    charging = _indicators(_default(true)),
    discharging = _indicators(_default(false)),
    ...props
}) => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: true, widget: charging },
        { value: false, widget: discharging },
    ],
    connections: [[Battery, dynamic => {
        const { charging, charged } = Battery;
        dynamic.update(value => value === charging || value === charged);
        dynamic.toggleClassName('charging', Battery.charging);
        dynamic.toggleClassName('charged', Battery.charged);
        dynamic.toggleClassName('low', Battery.percent < 30);
    }]],
});

Widget.widgets['battery/level-label'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Battery, label => label.label = `${Battery.percent}%`]],
});

Widget.widgets['battery/progress'] = props => Widget({
    ...props,
    type: 'box',
    className: 'battery-progress',
    connections: [[Battery, d => {
        d.toggleClassName('half', Battery.percent < 46);
        d.toggleClassName('charging', Battery.charging);
        d.toggleClassName('charged', Battery.charged);
        d.toggleClassName('low', Battery.percent < 30);
    }]],
    children: [{
        type: 'overlay',
        children: [
            {
                type: 'progressbar',
                hexpand: true,
                connections: [[Battery, progress => {
                    progress.setValue(Battery.percent / 100);
                }]],
            },
            {
                type: 'label',
                connections: [[Battery, l => {
                    l.label = Battery.charging || Battery.charged
                        ? '󱐋'
                        : `${Battery.percent}%`;
                }]],
            },
        ],
    }],
});
