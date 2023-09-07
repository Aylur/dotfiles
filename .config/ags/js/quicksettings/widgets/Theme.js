import Theme from '../../services/theme/theme.js';
import { ArrowToggleButton, Menu, opened } from '../ToggleButton.js';
import themes from '../../themes.js';
import icons from '../../icons.js';
import Separator from '../../misc/Separator.js';
const { Stack, Label, Box, Button, Icon } = ags.Widget;

const prettyName = name => name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const ThemeIcon = () => Stack({
    transition: 'crossfade',
    items: themes.map(({ name, icon }) => [name, Label(icon)]),
    connections: [[Theme, stack => stack.shown = Theme.getSetting('theme')]],
});

export const ThemeToggle = () => ArrowToggleButton({
    name: 'theme',
    icon: ThemeIcon(),
    label: Label({
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
    title: Label('Theme Selector'),
    content: Box({
        vertical: true,
        children: themes.map(({ name, icon }) => Button({
            onClicked: () => Theme.setSetting('theme', name),
            child: Box({
                children: [
                    Label(icon),
                    Label(prettyName(name)),
                    Icon({
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
            Button({
                onClicked: () => Theme.openSettings(),
                child: Box({
                    children: [
                        Icon(icons.settings),
                        Label('Theme Settings'),
                    ],
                }),
            }),
        ]),
    }),
});
