#!/bin/sh

mkdir -p theme
cp -r ./svgs/base/* ./theme/
cp ./gnome-shell-theme.gresource.xml ./theme
cp ./pad-osd.css ./theme/pad-osd.css
sassc ./gnome-shell.scss ./theme/gnome-shell.css
sassc ./gnome-shell.scss ./theme/gnome-shell-high-contrast.css
cd ./theme
rm ./gdm.png
ln -s $HOME/.config/background ./gdm.png
glib-compile-resources ./gnome-shell-theme.gresource.xml
sed -i -e 's/resource:\/\/\/org\/gnome\/shell\/theme/./g' ./gnome-shell.css
sed -i -e 's/resource:\/\/\/org\/gnome\/shell\/theme/./g' ./gnome-shell-high-contrast.css
mkdir -p $HOME/.local/share/themes/Smooth/gnome-shell
cp -r ./* $HOME/.local/share/themes/Smooth/gnome-shell/
sudo cp -r gnome-shell-theme.gresource /usr/share/gnome-shell/gnome-shell-theme.gresource
