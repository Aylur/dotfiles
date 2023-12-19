import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import RegularWindow from '../misc/RegularWindow.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import icons from '../icons.js';
import { getOptions, getValues } from './option.js';
import options from '../options.js';

const optionsList = getOptions();
const categories = Array.from(new Set(optionsList.map(opt => opt.category)))
    .filter(category => category !== 'exclude');

const currentPage = Variable(categories[0]);
const search = Variable('');
const showSearch = Variable(false);
showSearch.connect('changed', ({ value }) => {
    if (!value)
        search.value = '';
});

/** @param {import('./option.js').Opt<string>} opt */
const EnumSetter = opt => {
    const lbl = Widget.Label({ binds: [['label', opt]] });
    const step = (dir = 1) => {
        const i = opt.enums.findIndex(i => i === lbl.label);
        opt.setValue(dir > 0
            ? i + dir > opt.enums.length - 1
                ? opt.enums[0] : opt.enums[i + dir]
            : i + dir < 0
                ? opt.enums[opt.enums.length - 1] : opt.enums[i + dir],
            true);
    };
    const next = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.right),
        on_clicked: () => step(+1),
    });
    const prev = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.left),
        on_clicked: () => step(-1),
    });
    return Widget.Box({
        class_name: 'enum-setter',
        children: [prev, lbl, next],
    });
};

/** @param {import('./option.js').Opt} opt */
const Setter = opt => {
    switch (opt.type) {
        case 'number': return Widget.SpinButton({
            setup(self) {
                self.set_range(0, 1000);
                self.set_increments(1, 5);
            },
            connections: [
                ['value-changed', self => opt.setValue(self.value, true)],
                [opt, self => self.value = opt.value],
            ],
        });
        case 'float':
        case 'object': return Widget.Entry({
            on_accept: self => opt.setValue(JSON.parse(self.text || ''), true),
            connections: [[opt, self => self.text = JSON.stringify(opt.value)]],
        });
        case 'string': return Widget.Entry({
            on_accept: self => opt.setValue(self.text, true),
            connections: [[opt, self => self.text = opt.value]],
        });
        case 'enum': return EnumSetter(opt);
        case 'boolean': return Widget.Switch({
            connections: [
                ['notify::active', self => opt.setValue(self.active, true)],
                [opt, self => self.active = opt.value],
            ],
        });
        case 'img': return Widget.FileChooserButton({
            connections: [['selection-changed', self => {
                opt.setValue(self.get_uri()?.replace('file://', ''), true);
            }]],
        });
        case 'font': return Widget.FontButton({
            show_size: false,
            use_size: false,
            connections: [
                ['notify::font', ({ font }) => opt.setValue(font, true)],
                [opt, self => self.font = opt.value],
            ],
        });
        default: return Widget.Label({
            label: 'no setter with type ' + opt.type,
        });
    }
};

/** @param {import('./option.js').Opt} opt */
const Row = opt => Widget.Box({
    class_name: 'row',
    setup: self => self.opt = opt,
    children: [
        Widget.Box({
            vertical: true,
            vpack: 'center',
            children: [
                opt.title && Widget.Label({
                    xalign: 0,
                    class_name: 'summary',
                    label: opt.title,
                }),
                Widget.Label({
                    xalign: 0,
                    class_name: 'id',
                    label: `id: "${opt.id}"`,
                }),
            ],
        }),
        Widget.Box({ hexpand: true }),
        Widget.Box({
            vpack: 'center',
            vertical: true,
            children: [
                Widget.Box({
                    hpack: 'end',
                    child: Setter(opt),
                }),
                opt.note && Widget.Label({
                    xalign: 1,
                    class_name: 'note',
                    label: opt.note,
                }),
            ],
        }),
    ],
});

/** @param {string} category */
const Page = category => Widget.Scrollable({
    vexpand: true,
    class_name: 'page',
    child: Widget.Box({
        class_name: 'page-content vertical',
        vertical: true,
        connections: [[search, self => {
            for (const child of self.children) {
                child.visible =
                    child.opt.id.includes(search.value) ||
                    child.opt.title.includes(search.value) ||
                    child.opt.note.includes(search.value);
            }
        }]],
        children: optionsList
            .filter(opt => opt.category.includes(category))
            .map(Row),
    }),
});

const sidebar = Widget.Revealer({
    binds: [['reveal-child', search, 'value', v => !v]],
    transition: 'slide_right',
    child: Widget.Box({
        hexpand: false,
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'sidebar-header',
                children: [
                    Widget.Button({
                        hexpand: true,
                        label: icons.dialog.Search + ' Search',
                        on_clicked: () => showSearch.value = !showSearch.value,
                    }),
                    Widget.Button({
                        hpack: 'end',
                        child: Widget.Icon(icons.ui.info),
                        on_clicked: () => App.toggleWindow('about'),
                    }),
                ],
            }),
            Widget.Scrollable({
                vexpand: true,
                hscroll: 'never',
                child: Widget.Box({
                    class_name: 'sidebar-box vertical',
                    vertical: true,
                    children: [
                        ...categories.map(name => Widget.Button({
                            label: (icons.dialog[name] || '') + ' ' + name,
                            xalign: 0,
                            binds: [['class-name', currentPage, 'value',
                                v => v === name ? 'active' : '']],
                            on_clicked: () => currentPage.setValue(name),
                        })),
                    ],
                }),
            }),
            Widget.Box({
                class_name: 'sidebar-footer',
                child: Widget.Button({
                    class_name: 'copy',
                    child: Widget.Label({
                        label: ' Save',
                        xalign: 0,
                    }),
                    hexpand: true,
                    on_clicked: () => {
                        Utils.execAsync([
                            'wl-copy',
                            getValues(),
                        ]);
                        Utils.execAsync([
                            'notify-send',
                            '-i', 'preferences-desktop-theme-symbolic',
                            'Theme copied to clipboard',
                            'To save it permanently, make a new theme in <span weight="bold">themes.js</span>',
                        ]);
                    },
                }),
            }),
        ],
    }),
});

const searchEntry = Widget.Revealer({
    transition: 'slide_down',
    binds: [
        ['reveal-child', showSearch],
        ['transition-duration', options.transition],
    ],
    child: Widget.Entry({
        connections: [[showSearch, self => {
            if (!showSearch.value)
                self.text = '';

            if (showSearch.value)
                self.grab_focus();
        }]],
        hexpand: true,
        class_name: 'search',
        placeholder_text: 'Search Options',
        secondary_icon_name: icons.apps.search,
        on_change: ({ text }) => search.value = text || '',
    }),
});

const categoriesStack = Widget.Stack({
    transition: 'slide_left_right',
    items: categories.map(name => [name, Page(name)]),
    binds: [
        ['shown', currentPage],
        ['visible', search, 'value', v => !v],
    ],
});

const searchPage = Widget.Box({
    binds: [['visible', search, 'value', v => !!v]],
    child: Page(''),
});

export default RegularWindow({
    name: 'settings-dialog',
    title: 'Settings',
    setup: win => win.set_default_size(800, 500),
    connections: [
        ['delete-event', win => {
            win.hide();
            return true;
        }],
        ['key-press-event', (self, event) => {
            if (event.get_keyval()[1] === imports.gi.Gdk.KEY_Escape) {
                self.text = '';
                showSearch.setValue(false);
                search.setValue('');
            }
        }],
    ],
    child: Widget.Box({
        children: [
            sidebar,
            Widget.Box({
                vertical: true,
                children: [
                    searchEntry,
                    categoriesStack,
                    searchPage,
                ],
            }),
        ],
    }),
});
