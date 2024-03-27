import wallpaper from "service/wallpaper"

export default () => Widget.Box(
    { class_name: "row wallpaper" },
    Widget.Box(
        { vertical: true },
        Widget.Label({
            xalign: 0,
            class_name: "row-title",
            label: "Wallpaper",
            vpack: "start",
        }),
        Widget.Button({
            on_clicked: wallpaper.random,
            label: "Random",
        }),
        Widget.FileChooserButton({
            on_file_set: ({ uri }) => wallpaper.set(uri!.replace("file://", "")),
        }),
    ),
    Widget.Box({ hexpand: true }),
    Widget.Box({
        class_name: "preview",
        css: wallpaper.bind("wallpaper").as(wp => `
            min-height: 120px;
            min-width: 200px;
            background-image: url('${wp}');
            background-size: cover;
        `),
    }),
)
