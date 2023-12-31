import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';

export default () => Widget.Icon({
    class_name: 'battery',
    icon: Battery.bind('icon_name'),
    setup: icon => icon.hook(Battery, () => {
        icon.toggleClassName('charging', Battery.charging);
        icon.toggleClassName('charged', Battery.charged);
        icon.toggleClassName('low', Battery.percent < 30);
    }),
});
