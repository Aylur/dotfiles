#!/bin/sh

# this is just so that I don't have to home-manager switch
# when working on these configs

remove() {
	rm -rf ~/.config/ags
	rm -rf ~/.config/nvim
	rm -rf ~/.config/wezterm
	rm -rf ~/.config/hypr/config
}

symlink() {
	ln -s ~/Projects/dotfiles/ags ~/.config/ags
	ln -s ~/Projects/dotfiles/nvim ~/.config/nvim
	ln -s ~/Projects/dotfiles/wezterm ~/.config/wezterm
	ln -s ~/Projects/dotfiles/hypr ~/.config/hypr/config
}

remove
if ! [[ $1 == 'remove' ]]; then
	symlink
	rm ~/.config/mimeapps.list
fi
