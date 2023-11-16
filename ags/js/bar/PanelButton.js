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
}) => {
    let open = false;

    const connection = [App, (self, win, visible) => {
        if (win !== window)
            return;

        if (open && !visible) {
            open = false;
            self.toggleClassName('active', false);
        }

        if (visible) {
            open = true;
            self.toggleClassName('active');
        }
    }];

    return Widget.Button({
        class_name: `panel-button ${class_name}`,
        child: Widget.Box({ children: [content] }),
        connections: connections.concat([connection]),
        ...rest,
    });
};
