import icons from '../../icons.js';
import Separator from '../../misc/Separator.js';
import Asusctl from '../../services/asusctl.js';
import { ArrowToggleButton, Menu } from '../ToggleButton.js';
import { Widget } from '../../imports.js';

export const ProfileToggle = () => ArrowToggleButton({
    name: 'asusctl-profile',
    icon: Widget.Icon({
        binds: [['icon', Asusctl, 'profile', p => icons.asusctl.profile[p]]],
    }),
    label: Widget.Label({
        binds: [['label', Asusctl, 'profile']],
    }),
    connection: [Asusctl, () => Asusctl.profile !== 'Balanced'],
    activate: () => Asusctl.setProfile('Quiet'),
    deactivate: () => Asusctl.setProfile('Balanced'),
    activateOnArrow: false,
});

export const ProfileSelector = () => Menu({
    name: 'asusctl-profile',
    icon: Widget.Icon({
        binds: [['icon', Asusctl, 'profile', p => icons.asusctl.profile[p]]],
    }),
    title: Widget.Label('Profile Selector'),
    content: Widget.Box({
        vertical: true,
        hexpand: true,
        children: Asusctl.profiles.map(prof => Widget.Button({
            onClicked: () => Asusctl.setProfile(prof),
            child: Widget.Box({
                children: [
                    Widget.Icon(icons.asusctl.profile[prof]),
                    Widget.Label(prof),
                ],
            }),
        })).concat([
            Separator({ orientation: 'horizontal' }),
            Widget.Button({
                onClicked: 'rog-control-center',
                child: Widget.Box({
                    children: [
                        Widget.Icon(icons.settings),
                        Widget.Label('Rog Control Center'),
                    ],
                }),
            }),
        ]),
    }),
});
