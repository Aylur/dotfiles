import { Widget } from '../imports.js';

export default ({ className, content, ...rest }) => Widget.Button({
    className: `panel-button ${className}`,
    child: Widget.Box({ children: [content] }),
    ...rest,
});
