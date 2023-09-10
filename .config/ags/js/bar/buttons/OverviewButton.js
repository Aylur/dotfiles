import PanelButton from '../PanelButton.js';
import FontIcon from '../../misc/FontIcon.js';
import { distroIcon } from '../../variables.js';

export default () => PanelButton({
    className: 'overview',
    connections: [[ags.App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'overview' && visible);
    }]],
    onClicked: () => ags.App.toggleWindow('overview'),
    content: FontIcon(distroIcon),
});
