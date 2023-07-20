/* exported dialog */
const { Gtk } = imports.gi;
const { Settings } = ags.Service;

const row = (title, child) => ({
    type: 'box',
    className: 'row',
    children: [`${title}: `, child],
});

const img = (title, setting) => row(title, {
    type: () => Gtk.FileChooserButton.new(title, Gtk.FileChooserAction.OPEN),
    hexpand: true,
    halign: 'end',
    connections: [['selection-changed', w => Settings[setting] = w.get_uri().replace('file://', '')]],
});

const spinbutton = (title, styleprop, max, fallback, min = 0) => row(title, {
    type: () => Gtk.SpinButton.new_with_range(min, max, 1),
    setup: w => w.value = Settings.getStyle(styleprop) || fallback,
    hexpand: true,
    halign: 'end',
    connections: [['value-changed', w => {
        if (!w._first)
            return w._first = true;

        Settings.setStyle(styleprop, w.value);
    }]],
});

const color = (title, styleprop, fallback) => row(title, {
    type: 'box',
    hexpand: true,
    halign: 'end',
    className: 'color',
    children: [
        {
            type: 'entry',
            onAccept: value => Settings.setStyle(styleprop, value),
            text: Settings.getStyle(styleprop) || fallback,
            valign: 'center',
        },
        {
            type: () => new Gtk.ColorButton({ alpha: true }),
            setup: w => w.rgba.parse(Settings.getStyle(styleprop) || fallback),
            valign: 'center',
            connections: [['color-set', w => {
                w.get_parent().get_children()[0].set_text(w.rgba.to_string());
                Settings.setStyle(styleprop, w.rgba.to_string());
            }]],
        },
    ],
});

class Pages extends ags.Service {
    static { ags.Service.register(this); }
    static instance = new Pages();
    static page = 'General';
    static show(page) {
        Pages.page = page;
        Pages.instance.emit('changed');
    }
}

const tab = page => ({
    type: 'button',
    hexpand: true,
    className: 'tab',
    onClick: () => Pages.show(page),
    child: page,
    connections: [[Pages, b => b.toggleClassName('active', Pages.page === page)]],
});

const layout = pages => ({
    type: 'box',
    orientation: 'vertical',
    className: 'settings',
    hexpand: false,
    children: [
        {
            type: 'box',
            className: 'headerbar',
            valign: 'start',
            children: [{
                type: 'box',
                className: 'tabs',
                children: [
                    tab('General'),
                    tab('Borders'),
                    tab('Colors'),
                    tab('Dark'),
                    tab('Light'),
                ],
            }],
        },
        {
            type: 'box',
            className: 'content',
            children: [{
                type: 'dynamic',
                items: [
                    { value: 'General', widget: pages.general },
                    { value: 'Borders', widget: pages.borders },
                    { value: 'Colors', widget: pages.colors },
                    { value: 'Dark', widget: pages.dark },
                    { value: 'Light', widget: pages.light },
                ],
                connections: [[Pages, d => d.update(v => v === Pages.page)]],
            }],
        },
    ],
});

var dialog = () => {
    const win = new Gtk.Window({ name: 'settings' });
    win.set_default_size(240, 500);
    win.add(ags.Widget(layout({
        general: {
            type: 'box',
            orientation: 'vertical',
            children: [
                { type: 'wallpaper', className: 'row', hexpand: true, vexpand: true },
                img('Wallpaper', 'wallpaper'),
                img('Avatar', 'avatar'),
                spinbutton('Useless Gaps', 'gaps', 128, 16),
                spinbutton('Spacing', 'spacing', 18, 8),
            ],
        },
        borders: {
            type: 'box',
            orientation: 'vertical',
            children: [
                spinbutton('Border Radius', 'radius', 32, 7),
                spinbutton('Border Width', 'borderWidth', 4, 1),
                spinbutton('Border Opacity', 'borderOpacity', 100, 97),
            ],
        },
        colors: {
            type: 'box',
            orientation: 'vertical',
            children: [
                color('Accent Color', 'accent', '$blue'),
                color('Accent Foreground', 'accentFg', '#141414'),
                color('Widget Background', 'widgetBg', '$fg_color'),
                spinbutton('Widget Opacity', 'widgetOpacity', 100, 94, 4),
            ],
        },
        dark: {
            type: 'box',
            orientation: 'vertical',
            children: [
                color('Background Color', 'darkBg', '#171717'),
                color('Foreground Color', 'darkFg', '#eee'),
                color('Hover Foreground', 'darkHoverFg', '#f1f1f1'),
            ],
        },
        light: {
            type: 'box',
            orientation: 'vertical',
            children: [
                color('Background Color', 'lightBg', '#fff'),
                color('Foreground Color', 'lightFg', '#171717'),
                color('Hover Foreground', 'lightHoverFg', '#131313'),
            ],
        },
    })));
    return win;
};
