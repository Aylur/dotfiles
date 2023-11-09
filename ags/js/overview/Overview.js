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
const update = box => Utils.execAsync('hyprctl -j clients')
    .then(clients => {
        const json = JSON.parse(clients);
        box.children.forEach(ch => ch.update(json));
    })
    .catch(console.error);

export default () => PopupWindow({
    name: 'overview',
    content: Widget.Box({
        class_name: 'overview',
        children: range(ws).map(Workspace),
        setup: update,
        connections: [[Hyprland, box => {
            if (!App.getWindow('overview')?.visible)
                return;

            update(box);
        }]],
        binds: ws ? [] : [['children', Hyprland, 'workspaces',
            w => w.sort((ws1, ws2) => ws1.id < ws2.id).map(({ id }) => Workspace(id)),
        ]],
    }),
});
