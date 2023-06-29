const HOME = '/home/'+imports.gi.GLib.get_user_name();

var avatar = `${HOME}/Pictures/avatars/donna.jpg`;

var wallpapers = [
    '', // workspaces start from 1
    '/home/demeter/Pictures/Wallpapers/kitty/kittyr2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyy2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyc2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittybl.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyb2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyw.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittym2.jpeg',
];

var openSettings = `wezterm start nvim ${HOME}/.config/ags`;
