import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

/** @param {string} windowName */
const Padding = windowName => Widget.EventBox({
    class_name: 'padding',
    hexpand: true,
    vexpand: true,
    setup: w => w.on('button-press-event', () => App.toggleWindow(windowName)),
});

/**
 * @template {import('gi://Gtk?version=3.0').default.Widget} T
 * @param {import('types/widgets/window').WindowProps<T> & {
 *      name: string
 *      child: import('types/widgets/box').default
 *  }} o
 */
export default ({ name, child, ...rest }) => Widget.Window({
    ...rest,
    class_names: ['popup-window', name],
    name,
    visible: false,
    popup: true,
    keymode: 'on-demand',
    setup() {
        child.toggleClassName('window-content');
    },
    child: Widget.CenterBox({
        class_name: 'shader',
        css: 'min-width: 5000px; min-height: 3000px;',
        start_widget: Padding(name),
        end_widget: Padding(name),
        center_widget: Widget.CenterBox({
            vertical: true,
            start_widget: Padding(name),
            end_widget: Padding(name),
            center_widget: child,
        }),
    }),
});
