## Summary

Do not edit the CSS directly, edit the source SCSS files and the CSS files
will be generated automatically when building with meson + ninja and left
inside the build directory to be incorporated into the gresource XML (you'll
need to have sassc installed).

## How to tweak the theme

Adwaita is a complex theme, so to keep it maintainable it's written and
processed in SASS, the generated CSS is then transformed into a gresource
file during gtk build and used at runtime in a non-legible or editable form.

It is very likely your change will happen in the [_common.scss][common] file.
That's where all the widget selectors are defined. Here's a rundown of
the "supporting" stylesheets, that are unlikely to be the right place
for a drive by stylesheet fix:

| File                     | Description       |
| ------------------------ | ----------------- |
| [_colors.scss][colors]   | global color definitions. We keep the number of defined colors to a necessary minimum,  most colors are derived from a handful of basics. It is an exact copy of the gtk+ counterpart. Light theme is used for the classic theme and dark is for GNOME3 shell default. |
| [_drawing.scss][drawing] | drawing helper mixings/functions to allow easier definition of widget drawing under specific context. This is why Adwaita isn't 15000 LOC. |
| [_common.scss][common]   | actual definitions of style for each widget. This is where you are likely to add/remove your changes. |

You can read about SASS on its [web page][sass-web]. Once you make your
changes to the [_common.scss][common] file, you can run ninja to generate the
final CSS files.

[common]: data/theme/gnome-shell-sass/_common.scss
[colors]: data/theme/gnome-shell-sass/_colors.scss
[drawing]: data/theme/gnome-shell-sass/_drawing.scss
[sass-web]: http://sass-lang.com/documentation/
