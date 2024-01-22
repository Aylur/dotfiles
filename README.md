# Hyprland

![2023-11-18_18-17-48](https://github.com/Aylur/dotfiles/assets/104676705/2c256b0f-8103-4f2a-8211-647c9feaa078)
![2023-11-18_18-17-10](https://github.com/Aylur/dotfiles/assets/104676705/e8bbd929-9367-4f08-be65-34b03ef52a8e)
![2023-11-18_18-18-44](https://github.com/Aylur/dotfiles/assets/104676705/09a5b5a9-262f-4c29-9627-3cf48b6790ae)
![2023-11-18_18-28-40](https://github.com/Aylur/dotfiles/assets/104676705/d4ad404d-e5e7-448a-a7a7-a3f0b0858253)

## Dependencies

- [aylurs-gtk-shell](https://github.com/Aylur/ags/)
- sassc
- swww
- nerdfonts
- brightnessctl

### Optional Dependencies

- asusctl
- supergfxctl
- hyprpicker
- slurp
- wf-recorder
- wayshot
- imagemagick
- wl-gammactl
- pavucontrol
- swappy
- python
- python-pam

```bash
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

brightness adjusting
```
bindle=,XF86MonBrightnessUp,   exec, ags -r 'brightness.screen += 0.05; indicator.display()'
bindle=,XF86MonBrightnessDown, exec, ags -r 'brightness.screen -= 0.05; indicator.display()'
bindle=,XF86KbdBrightnessUp,   exec, ags -r 'brightness.kbd++; indicator.kbd()'
bindle=,XF86KbdBrightnessDown, exec, ags -r 'brightness.kbd--; indicator.kbd()'
```

volume adjusting
```
bindle=,XF86AudioRaiseVolume,  exec, ags -r 'audio.speaker.volume += 0.05; indicator.speaker()'
bindle=,XF86AudioLowerVolume,  exec, ags -r 'audio.speaker.volume -= 0.05; indicator.speaker()'
```

Please understand that this is my personal configuration for my setup.
If something doesn't work, feel free to open up an issue or message me,
and I will try to help. However, before doing that, make sure you read the error output,
use some common sense, and try to solve the problem yourself if it is something simple.
