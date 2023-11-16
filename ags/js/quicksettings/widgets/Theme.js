import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { ArrowToggleButton, Menu, opened } from '../ToggleButton.js';
import themes from '../../themes.js';
import icons from '../../icons.js';
import options from '../../options.js';
import { setTheme, openSettings } from '../../settings/theme.js';

export const ThemeToggle = () => ArrowToggleButton({
    name: 'theme',
    icon: Widget.Label({ binds: [['label', options.theme.icon]] }),
    label: Widget.Label({ binds: [['label', options.theme.name]] }),
    connection: [opened, () => opened.value === 'theme'],
    activate: () => opened.setValue('theme'),
    activateOnArrow: false,
    deactivate: () => { },
});

export const ThemeSelector = () => Menu({
    name: 'theme',
    icon: Widget.Label({
        binds: [['label', options.theme.icon]],
    }),
    title: Widget.Label('Theme Selector'),
    content: [
        ...themes.map(({ name, icon }) => Widget.Button({
            on_clicked: () => setTheme(name),
            child: Widget.Box({
                children: [
                    Widget.Label(icon),
                    Widget.Label(name),
                    Widget.Icon({
                        icon: icons.ui.tick,
                        hexpand: true,
                        hpack: 'end',
                        binds: [['visible', options.theme.name, 'value', v => v === name]],
                    }),
                ],
            }),
        })),
        Widget.Separator(),
        Widget.Button({
            on_clicked: openSettings,
            child: Widget.Box({
                children: [
                    Widget.Icon(icons.ui.settings),
                    Widget.Label('Theme Settings'),
                ],
            }),
        }),
    ],
});
