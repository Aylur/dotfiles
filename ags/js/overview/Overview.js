import PopupWindow from '../misc/PopupWindow.js';
import Workspace from './Workspace.js';
import options from '../options.js';
import { Utils, App, Widget, Hyprland } from '../imports.js';

const update = box => {
    Utils.execAsync('hyprctl -j clients')
        .then(clients => {
            const json = JSON.parse(clients);
            box.children.forEach(ch => ch.update(json));
        })
        .catch(console.error);
};

export default () => PopupWindow({
    name: 'overview',
    content: Widget.Box({
        className: 'overview',
        children: Array.from({ length: options.workspaces }, (_, i) => i + 1).map(Workspace),
        setup: update,
        connections: [[Hyprland, box => {
            if (!App.getWindow('overview').visible)
                return;

            update(box);
        }]],
    }),
});
