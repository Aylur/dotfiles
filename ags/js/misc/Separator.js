import Gtk from 'gi://Gtk';
import { Widget } from '../imports.js';

export default ({ orientation = 'vertical', ...rest } = {}) => Widget({
    ...rest,
    type: Gtk.Separator,
    orientation: Gtk.Orientation[orientation.toUpperCase()],
});
