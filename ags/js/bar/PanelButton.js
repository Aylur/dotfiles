/**
 * @typedef {Object} PanelButtonProps
 * @property {import('types/widgets/button').ButtonProps['child']} content
 * @property {string=} window
 */

/**
 * @param {import('types/widgets/button').ButtonProps & PanelButtonProps} o
 */
export default ({
    class_name,
    content,
    window = '',
    setup,
    ...rest
}) => Widget.Button({
    class_name: `panel-button ${class_name}`,
    child: Widget.Box({ children: [content] }),
    setup: self => {
        let open = false;

        self.hook(App, (_, win, visible) => {
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
        });

        if (setup)
            setup(self);
    },
    ...rest,
});
