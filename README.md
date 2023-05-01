# Hyprland
<img src="https://github.com/Aylur/dotfiles/blob/main/assets/hyprland.png">

## How to install
install dependencies, e.g on Arch
```bash
yay -S hyprland eww-wayland ttf-ubuntu-nerd socat jq acpi \
  bluez pavucontrol brightnessctl playerctl imagemagick \
  gjs gnome-bluetooth-3.0 upower networkmanager gtk3 \
  wl-gammactl wlsunset wl-clipboard hyprpicker hyprshot blueberry \
  polkit-gnome
```

clone repo and copy configs
```bash
git clone https://github.com/Aylur/dotfiles.git
cp -r dotfiles/.config/eww ~/.config/eww
cp -r dotfiles/.config/hypr ~/.config/hypr
mv ~/.config/hypr/_hyprland.conf ~/.config/hypr/hyprland.conf
```

Edit the hyprland config to your taste.
e.g edit the Print bind to not use Distrobox.

# Gnome
WIP
