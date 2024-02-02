import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import PopupWindow from '../misc/PopupWindow.js';
import Workspace from './Workspace.js';
import options from '../options.js';
import { range } from '../utils.js';

const ws = options.workspaces;

const Overview = () => Widget.Box({
    children: [Workspace(0)], // for type infer
    setup: self => Utils.idle(() => {
        self.hook(ws, () => {
            self.children = range(ws.value).map(Workspace);
            update(self);
            children(self);
        });
        self.hook(Hyprland, update);
        self.hook(Hyprland, children, 'notify::workspaces');
        update(self);
        children(self);
    }),
});

/** @param {ReturnType<typeof Overview>} box */
const update = box => {
    if (!box.get_parent()?.visible)
        return;

    Hyprland.sendMessage('j/clients')
        .then(clients => {
            box.children.forEach(ws => {
                ws.attribute(JSON.parse(clients));
            });
        })
        .catch(console.error);
};

/** @param {import('types/widgets/box').default} box */
const children = box => {
    if (ws.value === 0) {
        box.children = Hyprland.workspaces
            .sort((ws1, ws2) => ws1.id - ws2.id)
            .map(({ id }) => Workspace(id));
    }
};

export default () => PopupWindow({
    name: 'overview',
    child: Overview(),
});
