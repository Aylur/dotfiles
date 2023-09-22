import PopupWindow from '../misc/PopupWindow.js';
import Workspace from './Workspace.js';
import options from '../options.js';

export default () => PopupWindow({
    name: 'overview',
    content: ags.Widget.Box({
        className: 'overview',
        children: Array.from({ length: options.workspaces }, (_, i) => i + 1).map(Workspace),
        properties: [
            ['update', box => {
                ags.Utils.execAsync('hyprctl -j clients')
                    .catch(console.error)
                    .then(clients => {
                        const json = JSON.parse(clients);
                        box.children.forEach(ch => ch.update(json));
                    });
            }],
        ],
        setup: box => box._update(box),
        connections: [[ags.Service.Hyprland, box => {
            if (!ags.App.getWindow('overview').visible)
                return;

            box._update(box);
        }]],
    }),
});
