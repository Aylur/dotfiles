import Gtk from 'gi://Gtk';

export default props => ags.Widget({
    ...props,
    type: Gtk.Spinner,
    active: true,
});
