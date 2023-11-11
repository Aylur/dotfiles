import App from 'resource:///com/github/Aylur/ags/app.js';
import Clock from '../../misc/Clock.js';
import PanelButton from '../PanelButton.js';

export default ({ format = '%H:%M - %A %e.' } = {}) => PanelButton({
    class_name: 'dashboard panel-button',
    on_clicked: () => App.toggleWindow('dashboard'),
    window: 'dashboard',
    content: Clock({ format }),
});
