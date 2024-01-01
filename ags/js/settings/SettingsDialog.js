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
    const lbl = Widget.Label().bind('label', opt);
    const step = (dir = 1) => {
        const i = opt.enums.findIndex(i => i === lbl.label);
        opt.setValue(dir > 0
            ? i + dir > opt.enums.length - 1
                ? opt.enums[0] : opt.enums[i + dir]
            : i + dir < 0
                ? opt.enums[opt.enums.length - 1] : opt.enums[i + dir],
            true,
        );
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
                self.on('value-changed', () => opt.setValue(self.value, true));
                self.hook(opt, () => self.value = opt.value);
            },
        });
        case 'float':
        case 'object': return Widget.Entry({
            on_accept: self => opt.setValue(JSON.parse(self.text || ''), true),
            setup: self => self.hook(opt, () => self.text = JSON.stringify(opt.value)),
        });
        case 'string': return Widget.Entry({
            on_accept: self => opt.setValue(self.text, true),
            setup: self => self.hook(opt, () => self.text = opt.value),
        });
        case 'enum': return EnumSetter(opt);
        case 'boolean': return Widget.Switch()
            .on('notify::active', self => opt.setValue(self.active, true))
            .hook(opt, self => self.active = opt.value);

        case 'img': return Widget.FileChooserButton()
            .on('selection-changed', self => {
                opt.setValue(self.get_uri()?.replace('file://', ''), true);
            });

        case 'font': return Widget.FontButton({
            show_size: false,
            use_size: false,
            setup: self => self
                .on('notify::font', ({ font }) => opt.setValue(font, true))
                .hook(opt, () => self.font = opt.value),
        });
        default: return Widget.Label({
            label: 'no setter with type ' + opt.type,
        });
    }
};

/** @param {import('./option.js').Opt} opt */
const Row = opt => Widget.Box({
    class_name: 'row',
    attribute: opt,
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
        setup: self => self.hook(search, () => {
            for (const child of self.children) {
                child.visible =
                    child.attribute.id.includes(search.value) ||
                    child.attribute.title.includes(search.value) ||
                    child.attribute.note.includes(search.value);
            }
        }),
        children: optionsList
            .filter(opt => opt.category.includes(category))
            .map(Row),
    }),
});

const sidebar = Widget.Revealer({
    reveal_child: search.bind().transform(v => !v),
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
                            class_name: currentPage.bind().transform(v => `${v === name ? 'active' : ''}`),
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
    reveal_child: showSearch.bind(),
    transition_duration: options.transition.bind('value'),
    child: Widget.Entry({
        setup: self => self.hook(showSearch, () => {
            if (!showSearch.value)
                self.text = '';

            if (showSearch.value)
                self.grab_focus();
        }),
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
    shown: currentPage.bind(),
    visible: search.bind().transform(v => !v),
});

const searchPage = Widget.Box({
    visible: search.bind().transform(v => !!v),
    child: Page(''),
});

export default RegularWindow({
    name: 'settings-dialog',
    title: 'Settings',
    setup: win => win
        .on('delete-event', () => {
            win.hide();
            return true;
        })
        .on('key-press-event', (_, event) => {
            if (event.get_keyval()[1] === imports.gi.Gdk.KEY_Escape) {
                showSearch.setValue(false);
                search.setValue('');
            }
        })
        .set_default_size(800, 500),

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
