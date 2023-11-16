import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../../icons.js';
import Asusctl from '../../services/asusctl.js';
import { ArrowToggleButton, Menu } from '../ToggleButton.js';

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
    content: [
        Widget.Box({
            vertical: true,
            hexpand: true,
            children: [
                Widget.Box({
                    vertical: true,
                    children: Asusctl.profiles.map(prof => Widget.Button({
                        on_clicked: () => Asusctl.setProfile(prof),
                        child: Widget.Box({
                            children: [
                                Widget.Icon(icons.asusctl.profile[prof]),
                                Widget.Label(prof),
                            ],
                        }),
                    })),
                }),
            ],
        }),
        Widget.Separator(),
        Widget.Button({
            on_clicked: () => Utils.execAsync('rog-control-center'),
            child: Widget.Box({
                children: [
                    Widget.Icon(icons.ui.settings),
                    Widget.Label('Rog Control Center'),
                ],
            }),
        }),
    ],
});
