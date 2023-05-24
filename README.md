# Hyprland
<img src="https://github.com/Aylur/dotfiles/blob/main/assets/hyprland.png">

## Prerequisites
Make sure you have the following dependencies installed:

```
yay
hyprland
eww-wayland
ttf-ubuntu-nerd
socat
jq
acpi
inotify-tools
bluez
pavucontrol
brightnessctl
playerctl
nm-connection-editor
imagemagick
gjs
gnome-bluetooth-3.0
upower
networkmanager
gtk3
wl-gammactl
wlsunset
wl-clipboard
hyprpicker
hyprshot
blueberry
polkit-gnome
```
You can install these dependencies using the following command:

```bash
yay -S hyprland eww-wayland ttf-ubuntu-nerd socat jq acpi inotify-tools\
  bluez pavucontrol brightnessctl playerctl nm-connection-editor imagemagick \
  gjs gnome-bluetooth-3.0 upower networkmanager gtk3 \
  wl-gammactl wlsunset wl-clipboard hyprpicker hyprshot blueberry \
  polkit-gnome
```
## Clone the Repository
Clone the repository using the following command:

```bash
Copy code
git clone https://github.com/Aylur/dotfiles.git
```
## Copy Configurations
Copy the configuration files to their respective locations:
```bash
cp -r dotfiles/.config/eww ~/.config/eww
cp -r dotfiles/.config/hypr ~/.config/hypr
mv ~/.config/hypr/_hyprland.conf ~/.config/hypr/hyprland.conf
```
## Customize Configuration
Edit the hyprland.conf file located at ~/.config/hypr/hyprland.conf according to your preferences. For example, you can modify the keybinding for the Print key if you don't want to use Distrobox.
```bash
vim ~/.config/hypr/hyprland.conf
```
Make the necessary changes and save the file.
