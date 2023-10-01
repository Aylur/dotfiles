import { Utils, App } from '../../imports.js';

const generated = str => `// THIS FILE IS GENERATED
${str}`;

const scss = t => `$theme: '${t.color_scheme}';

$red: ${t.red};
$green: ${t.green};
$yellow: ${t.yellow};
$blue: ${t.blue};
$magenta: ${t.magenta};
$teal: ${t.teal};
$orange: ${t.orange};

$bg_color: ${t.bg_color};
$fg_color: ${t.fg_color};
$hover_fg: ${t.hover_fg};

$wm_gaps: ${t.wm_gaps}px;
$radii: ${t.radii}px;
$spacing: ${t.spacing}px;

$accent: ${t.accent};
$accent_fg: ${t.accent_fg};

$hover: transparentize(${t.widget_bg}, ${Math.max((t.widget_opacity * 0.90) / 100, 0)});
$widget_bg: transparentize(${t.widget_bg}, ${t.widget_opacity / 100});
$active_gradient: linear-gradient(${t.active_gradient});

$border_color: transparentize(${t.border_color}, ${t.border_opacity / 100});
$border_width: ${t.border_width}px;
$border: $border_width solid $border_color;

$shadow: ${t.shadow};
$text_shadow: 2px 2px 2px $shadow;
$icon_shadow: 2px 2px $shadow;

$popover_radius: ${t.radii * 1.7}px;
$popover_border_color: transparentize(${t.border_color}, ${Math.max((t.border_opacity - 1) / 100, 0)});
$popover_padding: ${t.spacing * 1.8}px;
$drop_shadow: ${t.drop_shadow};

$transition: ${t.transition}ms;

$font_size: ${t.font_size}px;
$font: '${t.font}';
$mono_font: '${t.mono_font}', monospace;
$wallpaper_fg: ${t.wallpaper_fg};
$shader_fg: white;

$screen_corners: ${t.bar_style === 'normal' && t.screen_corners};
$bar_style: ${t.bar_style};
$layout: ${t.layout};`;

export default async function(theme) {
    const tmp = '/tmp/ags/scss';
    Utils.ensureDirectory(tmp);
    try {
        await Utils.writeFile(generated(scss(theme)), `${tmp}/generated.scss`);
        await Utils.writeFile(generated(theme.additional_scss || ''), `${tmp}/additional.scss`);
        Utils.exec(`sassc ${App.configDir}/scss/main.scss ${tmp}/style.css`);
        App.resetCss();
        App.applyCss(`${tmp}/style.css`);
    } catch (error) {
        console.error(error);
    }
}
