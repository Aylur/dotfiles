# Hyprland

![2024-02-20_16-15-35](https://github.com/Aylur/dotfiles/assets/104676705/199c3441-c92e-49ee-b804-8de625f42329)
![2024-02-20_16-17-55](https://github.com/Aylur/dotfiles/assets/104676705/39cac513-998e-453f-b9e2-4b4f6f8d9c50)
![2024-02-20_16-17-23](https://github.com/Aylur/dotfiles/assets/104676705/80fdbc3c-7bc8-48d0-b33f-e743ecbdc2ff)
![2024-02-20_16-16-57](https://github.com/Aylur/dotfiles/assets/104676705/a66e6640-98d6-4ba3-83af-8df292cc3014)
![2024-02-20_16-30-56](https://github.com/Aylur/dotfiles/assets/104676705/71e54a51-8748-40e7-9c2e-b69c763506a1)


## Dependencies

- [aylurs-gtk-shell](https://github.com/Aylur/ags/)
- bun
- dart-sass
- fd
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
