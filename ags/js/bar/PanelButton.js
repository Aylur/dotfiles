import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';

/**
 * @typedef {Object} PanelButtonProps
 * @property {any} content
 * @property {string=} window
 */

/**
 * @param {import('types/widgets/button').ButtonProps & PanelButtonProps} o
 */
export default ({
    class_name,
    content,
    window = '',
    connections = [],
    ...rest
}) => Widget.Button({
    class_name: `panel-button ${class_name}`,
    setup: self => self.open = false,
    child: Widget.Box({ children: [content] }),
    connections: connections.concat([
        [App, (self, win, visible) => {
            if (win !== window)
                return;

            if (self.open && !visible) {
                self.open = false;
                self.toggleClassName('active', false);
            }

            if (visible) {
                self.open = true;
                self.toggleClassName('active');
            }
        }],
    ]),
    ...rest,
});
