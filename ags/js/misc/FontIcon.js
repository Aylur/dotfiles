import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import { Widget } from '../imports.js';

class FontIcon extends Gtk.Label {
    static { GObject.registerClass(this); }

    constructor(params = '') {
        const { icon = '', ...rest } = params;
        super(typeof params === 'string' ? {} : rest);
        this.toggleClassName('font-icon');

        if (typeof params === 'object')
            this.icon = icon;
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

export default params => typeof params === 'string'
    ? Widget({ type: FontIcon, icon: params })
    : Widget({ type: FontIcon, ...params });
