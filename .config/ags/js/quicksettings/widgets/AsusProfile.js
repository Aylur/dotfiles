import icons from '../../icons.js';
import Separator from '../../misc/Separator.js';
import Asusctl from '../../services/asusctl.js';
import { ArrowToggleButton, Menu } from '../ToggleButton.js';
const { Icon, Label, Box, Button } = ags.Widget;

export const ProfileToggle = () => ArrowToggleButton({
    name: 'asusctl-profile',
    icon: Icon({
        connections: [[Asusctl, icon => {
            icon.icon = icons.asusctl.profile[Asusctl.profile];
        }]],
    }),
    label: Label({
        connections: [[Asusctl, label => {
            label.label = Asusctl.profile;
        }]],
    }),
    connection: [Asusctl, () => Asusctl.profile !== 'Balanced'],
    activate: () => Asusctl.setProfile('Quiet'),
    deactivate: () => Asusctl.setProfile('Balanced'),
    activateOnArrow: false,
});

export const ProfileSelector = () => Menu({
    name: 'asusctl-profile',
    icon: Icon({
        connections: [[Asusctl, icon => {
            icon.icon = icons.asusctl.profile[Asusctl.profile];
        }]],
    }),
    title: Label('Profile Selector'),
    content: Box({
        vertical: true,
        hexpand: true,
        children: Asusctl.profiles.map(prof => Button({
            onClicked: () => Asusctl.setProfile(prof),
            child: Box({
                children: [
                    Icon(icons.asusctl.profile[prof]),
                    Label(prof),
                ],
            }),
        })).concat([
            Separator({ orientation: 'horizontal' }),
            Button({
                onClicked: 'rog-control-center',
                child: Box({
                    children: [
                        Icon(icons.settings),
                        Label('Rog Control Center'),
                    ],
                }),
            }),
        ]),
    }),
});
