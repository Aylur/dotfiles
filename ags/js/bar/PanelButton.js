import { Widget, App } from '../imports.js';

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
