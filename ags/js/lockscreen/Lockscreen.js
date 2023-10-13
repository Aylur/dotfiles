import Avatar from '../misc/Avatar.js';
import Spinner from '../misc/Spinner.js';
import Lockscreen from '../services/lockscreen.js';
import { Widget } from '../imports.js';
import Layer from 'gi://GtkLayerShell';

export default monitor => Widget.Window({
    name: `lockscreen${monitor}`,
    className: 'lockscreen',
    monitor,
    layer: 'overlay',
    visible: false,
    setup: self => Layer.set_keyboard_mode(self, Layer.KeyboardMode.EXCLUSIVE),
    connections: [[Lockscreen, (w, lock) => w.visible = lock, 'lock']],
    child: Widget.Box({
        style: 'min-width: 3000px; min-height: 2000px;',
        className: 'shader',
        child: Widget.Box({
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
                Widget.Box({
                    children: [
                        Widget.Entry({
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
        }),
    }),
});
