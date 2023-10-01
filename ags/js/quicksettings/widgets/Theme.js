import Theme from '../../services/theme/theme.js';
import { ArrowToggleButton, Menu, opened } from '../ToggleButton.js';
import themes from '../../themes.js';
import icons from '../../icons.js';
import Separator from '../../misc/Separator.js';
import { Widget } from '../../imports.js';

const prettyName = name => name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const ThemeIcon = () => Widget.Stack({
    transition: 'crossfade',
    items: themes.map(({ name, icon }) => [name, Widget.Label(icon)]),
    connections: [[Theme, stack => stack.shown = Theme.getSetting('theme')]],
});

export const ThemeToggle = () => ArrowToggleButton({
    name: 'theme',
    icon: ThemeIcon(),
    label: Widget.Label({
        connections: [[Theme, label => {
            label.label = prettyName(Theme.getSetting('theme'));
        }]],
    }),
    connection: [opened, () => opened.value === 'theme'],
    activate: () => opened.setValue('theme'),
    activateOnArrow: false,
    deactivate: () => { },
});

export const ThemeSelector = () => Menu({
    name: 'theme',
    icon: ThemeIcon(),
    title: Widget.Label('Theme Selector'),
    content: Widget.Box({
        vertical: true,
        children: themes.map(({ name, icon }) => Widget.Button({
            onClicked: () => Theme.setSetting('theme', name),
            child: Widget.Box({
                children: [
                    Widget.Label(icon),
                    Widget.Label(prettyName(name)),
                    Widget.Icon({
                        icon: icons.tick,
                        hexpand: true,
                        halign: 'end',
                        connections: [[Theme, icon => {
                            icon.visible = Theme.getSetting('theme') === name;
                        }]],
                    }),
                ],
            }),
        })).concat([
            Separator({ orientation: 'horizontal' }),
            Widget.Button({
                onClicked: () => Theme.openSettings(),
                child: Widget.Box({
                    children: [
                        Widget.Icon(icons.settings),
                        Widget.Label('Theme Settings'),
                    ],
                }),
            }),
        ]),
    }),
});
