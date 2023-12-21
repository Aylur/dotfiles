import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk';
import AgsWidget from 'resource:///com/github/Aylur/ags/widgets/widget.js';

class RegularWindow extends AgsWidget(Gtk.Window, 'RegularWindow') {
    static { AgsWidget.register(this); }
    /**
     * @param {import('types/widgets/widget').BaseProps<
     *      RegularWindow, Gtk.Window.ConstructorProperties
     * >} params */
    constructor(params) {
        // @ts-expect-error
        super(params);
    }
}

export default Widget.createCtor(RegularWindow);
