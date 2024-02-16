# Hyprland

WIP

## Dependencies

- [aylurs-gtk-shell](https://github.com/Aylur/ags/)
- bun
- dart-sass
- brightnessctl
- swww

### Optional Dependencies

- [matugen](https://github.com/InioX/matugen)
- hyprpicker
- slurp
- wf-recorder
- wl-clipboard
- wayshot
- swappy
- asusctl
- supergfxctl

```bash
# make sure to instal the dependencies first
git clone https://github.com/Aylur/dotfiles.git
cp -r dotfiles/ags $HOME/.config/ags

# then run
ags
```

## Hyprland Bindings

some bindings you might want in your hyprland.conf

reload
```
bind=CTRL SHIFT, R,  exec, ags -q; ags
```

opening windows
```
bind=SUPER, R,       exec, ags -t applauncher
bind=,XF86PowerOff,  exec, ags -t powermenu
bind=SUPER, Tab,     exec, ags -t overview
```

screenshot & screenrecord
```
bind=,XF86Launch4,   exec, ags -r 'recorder.start()'
bind=,Print,         exec, ags -r 'recorder.screenshot()'
bind=SHIFT,Print,    exec, ags -r 'recorder.screenshot(true)'
```

Please understand that this is my personal configuration for my setup.
If something doesn't work, feel free to open up an issue or message me,
and I will try to help. However, before doing that, make sure you read the error output,
use some common sense, and try to solve the problem yourself if it is something simple.
