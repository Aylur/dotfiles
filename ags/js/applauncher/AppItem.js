import options from '../options.js';

/** @param {import('resource:///com/github/Aylur/ags/service/applications.js').Application} app */
export default app => {
    const title = Widget.Label({
        class_name: 'title',
        label: app.name,
        xalign: 0,
        vpack: 'center',
        truncate: 'end',
    });

    const description = Widget.Label({
        class_name: 'description',
        label: app.description || '',
        wrap: true,
        xalign: 0,
        justification: 'left',
        vpack: 'center',
    });

    const icon = Widget.Icon({
        icon: Utils.lookUpIcon(app.icon_name || '') ? app.icon_name || '' : '',
        size: options.applauncher.icon_size.bind('value'),
    });

    const textBox = Widget.Box({
        vertical: true,
        vpack: 'center',
        children: app.description ? [title, description] : [title],
    });

    return Widget.Button({
        class_name: 'app-item',
        attribute: app,
        child: Widget.Box({
            children: [icon, textBox],
        }),
        on_clicked: () => {
            App.closeWindow('applauncher');
            app.launch();
        },
    });
};
