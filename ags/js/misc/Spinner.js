import Gtk from 'gi://Gtk';
import { Widget } from '../imports.js';

export default props => Widget({
    ...props,
    type: Gtk.Spinner,
    active: true,
});
