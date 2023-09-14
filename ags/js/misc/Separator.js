import Gtk from 'gi://Gtk';

export default ({ orientation = 'vertical', ...rest } = {}) => ags.Widget({
    ...rest,
    type: Gtk.Separator,
    orientation: Gtk.Orientation[orientation.toUpperCase()],
});
