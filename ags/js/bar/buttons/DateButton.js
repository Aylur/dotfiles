import Clock from '../../misc/Clock.js';
import PanelButton from '../PanelButton.js';

export default ({ format = '%H:%M - %A %e.' } = {}) => PanelButton({
    className: 'dashboard panel-button',
    onClicked: () => ags.App.toggleWindow('dashboard'),
    connections: [[ags.App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'dashboard' && visible);
    }]],
    child: Clock({ format }),
});
