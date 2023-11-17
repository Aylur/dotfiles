import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import PopupWindow from '../misc/PopupWindow.js';
import Workspace from './Workspace.js';
import options from '../options.js';
import { range } from '../utils.js';

const ws = options.workspaces;

/** @param {import('types/widgets/box').default} box */
const update = box => {
    if (App.windows.has('overview') && !App.getWindow('overview')?.visible)
        return;

    Utils.execAsync('hyprctl -j clients')
        .then(clients => {
            const json = JSON.parse(clients);
            box.children.forEach(ch => ch.update(json));
        })
        .catch(console.error);
};

/** @param {import('types/widgets/box').default} box */
const children = box => {
    if (ws.value === 0) {
        box.children = Hyprland.workspaces
            .sort((ws1, ws2) => ws1.id > ws2.id)
            .map(({ id }) => Workspace(id));
    }
};

export default () => PopupWindow({
    name: 'overview',
    child: Widget.Box({
        setup: update,
        connections: [
            [ws, box => {
                box.children = range(ws.value).map(Workspace);
                update(box);
                children(box);
            }],
            [Hyprland, update],
            [Hyprland, children, 'notify::workspaces'],
        ],
    }),
});
