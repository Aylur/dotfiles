import { Battery, Widget } from '../imports.js';

export default () => Widget.Icon({
    className: 'battery',
    binds: [['icon', Battery, 'icon-name']],
    connections: [[Battery, stack => {
        const { charging, charged } = Battery;
        stack.shown = `${charging || charged}`;
        stack.toggleClassName('charging', Battery.charging);
        stack.toggleClassName('charged', Battery.charged);
        stack.toggleClassName('low', Battery.percent < 30);
    }]],
});
