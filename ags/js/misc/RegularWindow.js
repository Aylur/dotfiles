import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk';

/** @type {function(Gtk.Window.ConstructorProperties & import('types/widgets/widget').BaseProps): Gtk.Window } */
export default Widget.subclass(Gtk.Window, 'RegularWindow');
