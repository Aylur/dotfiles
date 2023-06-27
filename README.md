# Hyprland

WIP

```bash
# ags
git clone https://github.com/Aylur/ags.git
cd ags
meson setup build
meson install -C build

# config
git clone https://github.com/Aylur/dotfiles.git
cd dotfiles
cp -r .config/ags $HOME/.config/ags

# then run
ags
```

I don't guarantee that it works on your setup. I will write some guide sometime in the future.
