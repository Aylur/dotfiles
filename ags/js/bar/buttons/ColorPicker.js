import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Colors from '../../services/colorpicker.js';
import PanelButton from '../PanelButton.js';
import Gdk from 'gi://Gdk';

export default () => PanelButton({
    class_name: 'color-picker',
    content: Widget.Icon('color-select-symbolic'),
    tooltip_text: Colors.bind('colors').transform(v => `${v.length} colors`),
    on_clicked: () => Colors.pick(),
    on_secondary_click: btn => {
        if (Colors.colors.length === 0)
            return;

        Widget.Menu({
            class_name: 'colorpicker',
            children: Colors.colors.map(color => Widget.MenuItem({
                child: Widget.Label(color),
                css: `background-color: ${color}`,
                on_activate: () => Colors.wlCopy(color),
            })),
        }).popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null);
    },
});
