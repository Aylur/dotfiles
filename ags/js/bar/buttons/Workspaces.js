import { Hyprland, Widget, Utils } from '../../imports.js';
import options from '../../options.js';

export default ({ workspaces = options.workspaces } = {}) => Widget.Box({
    className: 'workspaces panel-button',
    child: Widget.Box({
        children: [Widget.EventBox({
            onScrollUp: () => Utils.execAsync('hyprctl dispatch workspace +1'),
            onScrollDown: () => Utils.execAsync('hyprctl dispatch workspace -1'),
            className: 'eventbox',
            child: Widget.Box({
                children: Array.from({ length: workspaces }, (_, i) => i + 1).map(i => Widget.Button({
                    onClicked: () => Utils.execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
                    child: Widget.Label({
                        label: `${i}`,
                        className: 'indicator',
                        valign: 'center',
                    }),
                    connections: [[Hyprland, btn => {
                        const occupied = Hyprland.getWorkspace(i)?.windows > 0;
                        btn.toggleClassName('active', Hyprland.active.workspace.id === i);
                        btn.toggleClassName('occupied', occupied);
                    }]],
                })),
            }),
        })],
    }),
});
