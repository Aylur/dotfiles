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
            className: 'indicator',
            valign: 'center',
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
    className: 'workspaces panel-button',
    child: Widget.Box({
        // its nested like this to keep it consistent with other PanelButton widgets
        child: Widget.EventBox({
            onScrollUp: dispatch(`${ws ? 'r' : 'm'}+1`),
            onScrollDown: dispatch(`${ws ? 'r' : 'm'}-1`),
            className: 'eventbox',
            child: Workspaces(),
        }),
    }),
});
