import PanelButton from '../PanelButton.js';
import FontIcon from '../../misc/FontIcon.js';
import { distroIcon } from '../../variables.js';
import { App } from '../../imports.js';

export default () => PanelButton({
    className: 'overview',
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'overview' && visible);
    }]],
    onClicked: () => App.toggleWindow('overview'),
    content: FontIcon(distroIcon),
});
