import Avatar from '../misc/Avatar.js';
import Spinner from '../misc/Spinner.js';
import Lockscreen from '../services/lockscreen.js';
const { GtkLayerShell: Layer } = imports.gi;
const { Entry, Box, Window } = ags.Widget;

export default monitor => Window({
    name: `lockscreen${monitor}`,
    className: 'lockscreen',
    monitor,
    layer: 'overlay',
    visible: false,
    setup: self => Layer.set_keyboard_mode(self, Layer.KeyboardMode.EXCLUSIVE),
    connections: [[Lockscreen, (w, lock) => w.visible = lock, 'lock']],
    child: Box({
        style: 'min-width: 3000px; min-height: 2000px;',
        className: 'shader',
        children: [Box({
            className: 'content',
            vertical: true,
            hexpand: true,
            vexpand: true,
            halign: 'center',
            valign: 'center',
            children: [
                Avatar({
                    shader: false,
                    halign: 'center',
                    valign: 'center',
                }),
                Box({
                    children: [
                        Entry({
                            connections: [[Lockscreen, entry => entry.text = '', 'lock']],
                            visibility: false,
                            placeholderText: 'Password',
                            onAccept: ({ text }) => Lockscreen.auth(text),
                            halign: 'center',
                            hexpand: true,
                        }),
                        Spinner({
                            valign: 'center',
                            connections: [[Lockscreen, (w, auth) => w.visible = auth, 'authenticating']],
                        }),
                    ],
                }),
            ],
        })],
    }),
});
