import PanelButton from '../PanelButton.js';
import FontIcon from '../../misc/FontIcon.js';
import { distroIcon } from '../../variables.js';
import { App } from '../../imports.js';

export default () => PanelButton({
    class_name: 'overview',
    window: 'overview',
    onClicked: () => App.toggleWindow('overview'),
    content: FontIcon(distroIcon),
});
