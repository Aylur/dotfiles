const { Widget } = ags;
const { Settings } = ags.Service;

Widget.widgets['darkmode/toggle'] = props => Widget({
    ...props,
    type: 'button',
    hexpand: true,
    onClick: () => Settings.darkmode = !Settings.darkmode,
    connections: [[Settings, button => {
        button.toggleClassName('on', Settings.darkmode);
    }]],
});

Widget.widgets['darkmode/indicator'] = props => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: false, widget: { type: 'icon', icon: 'weather-clear-symbolic' } },
        { value: true, widget: { type: 'icon', icon: 'weather-clear-night-symbolic' } },
    ],
    connections: [[Settings, dynamic => {
        dynamic.update(value => value === Settings.darkmode);
    }]],
});
