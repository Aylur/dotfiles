const { Button, Box } = ags.Widget;

export default ({ className, content, ...rest }) => Button({
    className: `panel-button ${className}`,
    child: Box({ children: [content] }),
    ...rest,
});
