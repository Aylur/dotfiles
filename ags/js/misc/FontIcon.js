import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import AgsLabel from 'resource:///com/github/Aylur/ags/widgets/label.js';

class FontIcon extends AgsLabel {
    static { GObject.registerClass(this); }

    constructor(params = '') {
        const { icon = '', ...rest } = params;
        super(typeof params === 'string' ? {} : rest);
        this.toggleClassName('font-icon');

        if (typeof params === 'object')
            this.icon = icon;

        if (typeof params === 'string')
            this.icon = params;
    }

    get icon() { return this.label; }
    set icon(icon) { this.label = icon; }

    get size() {
        return this.get_style_context()
            .get_property('font-size', Gtk.StateFlags.NORMAL);
    }

    vfunc_get_preferred_height() {
        return [this.size, this.size];
    }

    vfunc_get_preferred_width() {
        return [this.size, this.size];
    }
}

export default params => new FontIcon(params);
