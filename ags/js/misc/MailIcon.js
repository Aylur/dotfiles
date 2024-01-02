import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../icons.js';
import { mailcounter } from '../variables.js';

export default () => Widget.Icon({
    className: 'mail',
    binds: [['icon', mailcounter, 'value', v => (v == 0) ? icons['mail']['empty'] : icons['mail']['unread']]],
});
