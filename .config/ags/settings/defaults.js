const { USER } = ags.Utils;

/* exported defaults */
var defaults = {
    avatar: `/home/${USER}/Pictures/avatars/donna.jpg`,
    wallpaper: `/home/${USER}/Pictures/Wallpapers/kitty/kittyb2.jpeg`,
    darkmode: true,
    preferredMpris: 'spotify',
    userName: USER,
    style: {
        layout: 'topbar',
        floating_bar: false,
        wm_gaps: 16,
        spacing: 9,
        radii: 7,
        border_width: 1,
        border_opacity: 97,
        screen_corners: true,
        accent: '$blue',
        accent_fg: '#141414',
        active_gradient: 'to right, $accent, lighten($accent, 4%)',
        bg: '$fg_color',
        widget_opacity: 94,
        dark_bg_color: '#171717',
        dark_fg_color: '#eee',
        dark_hover_fg: '#f1f1f1',
        light_bg_color: '#fff',
        light_fg_color: '#171717',
        light_hover_fg: '#131313',
    },
};
