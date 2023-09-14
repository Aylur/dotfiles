import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
const { Icon } = ags.Widget;

export default () => PanelButton({
    className: 'powermenu',
    content: Icon(icons.powermenu.shutdown),
    onClicked: () => ags.App.openWindow('powermenu'),
});
