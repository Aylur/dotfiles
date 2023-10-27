import { Widget, App } from '../imports.js';

export default ({
    className,
    content,
    window = '',
    connections = [],
    ...rest
}) => Widget.Button({
    className: `panel-button ${className}`,
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
