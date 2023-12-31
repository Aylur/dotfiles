import AgsWindow from 'resource:///com/github/Aylur/ags/widgets/window.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import options from '../options.js';
import GObject from 'gi://GObject';

export class PopupWindow extends AgsWindow {
    static { GObject.registerClass(this); }

    constructor({ name, child, transition = 'none', visible = false, ...rest }) {
        super({
            ...rest,
            name,
            popup: true,
            focusable: true,
            class_names: ['popup-window', name],
        });

        child.toggleClassName('window-content');
        this.revealer = Widget.Revealer({
            transition,
            child,
            transition_duration: options.transition.value,
            setup: self => self.hook(App, (_, wname, visible) => {
                if (wname === name)
                    this.revealer.reveal_child = visible;
            }),
        });

        this.child = Widget.Box({
            css: 'padding: 1px;',
            child: this.revealer,
        });

        this.show_all();
        this.visible = visible;
    }

    set transition(dir) { this.revealer.transition = dir; }
    get transition() { return this.revealer.transition; }
}

/** @param {import('types/widgets/window').WindowProps & {
 *      name: string
 *      child: import('types/widgets/box').default
 *      transition?: import('types/widgets/revealer').RevealerProps['transition']
 *  }} config
 */
export default config => new PopupWindow(config);
