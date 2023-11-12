/**
 * A Theme is a set of options that will be applied
 * ontop of the default values. see options.js for possible options
 */
import { Theme, WP, lightColors } from './settings/theme.js';

export default [
    Theme({
        name: 'Kitty Dark',
        icon: '󰄛',
    }),
    Theme({
        name: 'Kitty Light',
        icon: '󰄛',
        ...lightColors,
        'widget.bg': '$accent',
        'widget.opacity': 64,
    }),
    Theme({
        name: 'Leaves',
        icon: '󰌪',
        'desktop.wallpaper': WP + 'leaves.jpg',
        'accent.accent': '$green',
        'widget.opacity': 92,
        'accent.gradient': 'to right, $accent, darken($accent, 14%)',
        'border.opacity': 86,
        'color.bg': 'transparentize(#171717, 0.3)',
        'hypr.active_border': 'rgba(57e389FF)',
        'bar.style': 'floating',
        'radii': 0,
    }),
    Theme({
        name: 'Ivory',
        icon: '󰟆',
        ...lightColors,
        'desktop.wallpaper': WP + 'ivory.png',
        'desktop.fg_color': '$bg_color',
        'desktop.screen_corners': false,
        'bar.style': 'separated',
        'widget.bg': '$accent',
        'widget.opacity': 64,
        'drop_shadow': false,
        'border.width': 2,
        'border.opacity': 0,
        'accent.gradient': 'to right, $accent, darken($accent, 6%)',
        'hypr.active_border': 'rgba(111111FF)',
    }),
    Theme({
        name: 'Space',
        icon: '',
        'desktop.wallpaper': WP + 'space.jpg',
        'spacing': 11,
        'padding': 10,
        'radii': 12,
        'accent.accent': '$magenta',
        'desktop.screen_corners': false,
        'desktop.clock.enable': false,
        'bar.separators': false,
        'bar.icon': '',
        'color.bg': 'transparentize(#171717, 0.3)',
        'widget.opacity': 95,
        'popover.padding.multiplier': 1.8,
        'bar.flat_buttons': false,
    }),
];
