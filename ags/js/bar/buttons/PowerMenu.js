import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
import { Widget, App } from '../../imports.js';

export default () => PanelButton({
    class_name: 'powermenu',
    content: Widget.Icon(icons.powermenu.shutdown),
    onClicked: () => App.openWindow('powermenu'),
});
