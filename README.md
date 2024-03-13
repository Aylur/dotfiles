# Hyprland

![2024-02-20_16-53-17](https://github.com/Aylur/dotfiles/assets/104676705/e1b76d0c-7a3e-48c1-ad68-e4032d7fcc24)
![2024-02-20_18-00-11](https://github.com/Aylur/dotfiles/assets/104676705/b82d0782-0cdf-4aa1-8f7d-1ba7ba01c733)
![2024-02-20_16-52-34](https://github.com/Aylur/dotfiles/assets/104676705/eaae2e2e-3ba9-4640-8bca-098ade9d83a3)
![2024-02-20_16-51-24](https://github.com/Aylur/dotfiles/assets/104676705/94f2fe81-e986-49e1-a72b-21ce05218321)
![2024-02-20_16-50-17](https://github.com/Aylur/dotfiles/assets/104676705/0679ad78-75e9-4982-b0cb-71bda87cce17)
![2024-02-20_16-49-14](https://github.com/Aylur/dotfiles/assets/104676705/afb646d9-be8c-41c9-b176-6b3d279dfa8f)

## Installation

### With Nix

install nix

```bash
sh <(curl -L https://nixos.org/nix/install) --no-daemon
 . ~/.nix-profile/etc/profile.d/nix.sh
export NIX_CONFIG="experimental-features = nix-command flakes"
```

install desktop

```bash
nix profile install github:Aylur/dotfiles
```

login into Hyprland and run

```bash
asztal
```

### Without Nix

install these dependencies

- [aylurs-gtk-shell](https://github.com/Aylur/ags/), and its optional dependencies
- bun
- dart-sass
- fd
- brightnessctl
- swww
- [matugen](https://github.com/InioX/matugen)

optionally these too

- fzf
- hyprpicker
- slurp
- wf-recorder
- wl-clipboard
- wayshot
- swappy
- asusctl
- supergfxctl

git clone, copy files

```bash
git clone https://github.com/Aylur/dotfiles.git
cp -r dotfiles/ags $HOME/.config/ags
```

login to Hyprland then run

```bash
ags
```

## Hyprland Bindings

some bindings you might want in your hyprland.conf

reload

```ini
bind=CTRL SHIFT, R,  exec, ags -q; ags
```

opening windows

```ini
bind=SUPER, R,       exec, ags -t launcher
bind=,XF86PowerOff,  exec, ags -t powermenu
bind=SUPER, Tab,     exec, ags -t overview
```

screenshot & screenrecord

```ini
bind=,XF86Launch4,   exec, ags -r 'recorder.start()'
bind=,Print,         exec, ags -r 'recorder.screenshot()'
bind=SHIFT,Print,    exec, ags -r 'recorder.screenshot(true)'
```

Please understand that this is my personal configuration for my setup.
If something doesn't work, feel free to open up an issue or message me,
and I will try to help. However, before doing that,
make sure you read the error output, use some common sense,
and try to solve the problem yourself if it is something simple.
