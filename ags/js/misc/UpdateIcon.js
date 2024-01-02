import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../icons.js';
import { updates } from '../variables.js';

export default () => Widget.Icon({
    className: 'updates',
    binds: [['icon', updates, 'value', v => (v == 0) ? icons['system']['no_updates'] : icons['system']['updates']]],
});
