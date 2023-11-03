import { Hyprland, Widget, Utils } from '../../imports.js';
import options from '../../options.js';
import { range } from '../../utils.js';

const ws = options.workspaces;
const dispatch = arg => () => Utils.execAsync(`hyprctl dispatch workspace ${arg}`);

const Workspaces = () => Widget.Box({
    children: range(ws || 20).map(i => Widget.Button({
        setup: btn => btn.id = i,
        onClicked: dispatch(i),
        child: Widget.Label({
            label: `${i}`,
            class_name: 'indicator',
            vpack: 'center',
        }),
        connections: [[Hyprland, btn => {
            btn.toggleClassName('active', Hyprland.active.workspace.id === i);
            btn.toggleClassName('occupied', Hyprland.getWorkspace(i)?.windows > 0);
        }]],
    })),
    connections: ws ? [] : [[Hyprland.active.workspace, box => box.children.map(btn => {
        btn.visible = Hyprland.workspaces.some(ws => ws.id === btn.id);
    })]],
});

export default () => Widget.Box({
    class_name: 'workspaces panel-button',
    child: Widget.Box({
        // its nested like this to keep it consistent with other PanelButton widgets
        child: Widget.EventBox({
            onScrollUp: dispatch('m+1'),
            onScrollDown: dispatch('m-1'),
            class_name: 'eventbox',
            child: Workspaces(),
        }),
    }),
});
