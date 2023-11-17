import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PopupWindow from '../misc/PopupWindow.js';
import icons from '../icons.js';

const pkg = JSON.parse(Utils.readFile(App.configDir + '/package.json'));
const show = JSON.parse(Utils.readFile(Utils.CACHE_DIR + '/show_about') || 'true');
const dontShow = () => Utils.writeFile('false', Utils.CACHE_DIR + '/show_about');
const avatar = App.configDir + '/assets/aylur.jpg';

/**
 * @param {Object} o
 * @param {string} o.label
 * @param {string} o.link
 */
const LinkButton = ({ label, link }) => Widget.Button({
    on_clicked: () => Utils.execAsync(['xdg-open', link]),
    child: Widget.Box({
        children: [
            Widget.Label({ label, hexpand: true, xalign: 0 }),
            Widget.Icon(icons.ui.link),
        ],
    }),
});

export default () => PopupWindow({
    name: 'about',
    transition: 'slide_down',
    child: Widget.Box({
        vertical: true,
        class_name: 'window-content',
        children: [
            Widget.Box({
                class_name: 'avatar',
                hpack: 'center',
                css: `background-image: url('${avatar}');`,
            }),
            Widget.Box({
                vertical: true,
                class_name: 'labels vertical',
                children: [
                    Widget.Label({
                        class_name: 'title',
                        label: pkg.description,
                    }),
                    Widget.Label({
                        class_name: 'author',
                        label: pkg.author,
                    }),
                    Widget.Label({
                        class_name: 'version',
                        hpack: 'center',
                        label: pkg.version,
                    }),
                ],
            }),
            Widget.Box({
                class_name: 'buttons',
                vertical: true,
                vexpand: true,
                vpack: 'end',
                children: [
                    LinkButton({
                        label: 'Support me on Ko-fi',
                        link: pkg.kofi,
                    }),
                    LinkButton({
                        label: 'Report an Issue',
                        link: pkg.bugs.url,
                    }),
                ],
            }),
            Widget.Button({
                class_name: 'dont-show',
                on_clicked: () => {
                    dontShow();
                    App.toggleWindow('about');
                },
                child: Widget.Box({
                    children: [
                        Widget.Label("Don't show again"),
                        Widget.Box({ hexpand: true }),
                        Widget.Icon(icons.ui.close),
                    ],
                }),
            }),
        ],
    }),
});

export function showAbout(force = false) {
    if (show || force)
        App.toggleWindow('about');
}
