#!/bin/sh

# this is just so that I don't have to home-manager switch
# when working on these configs

remove() {
	rm ~/.config/ags
	rm ~/.config/nvim
	rm ~/.config/wezterm
	rm ~/.config/hypr
}

symlink() {
	ln -s ~/Projects/dotfiles/ags ~/.config/ags
	ln -s ~/Projects/dotfiles/nvim ~/.config/nvim
	ln -s ~/Projects/dotfiles/wezterm ~/.config/wezterm
	ln -s ~/Projects/dotfiles/hypr ~/.config/hypr
}

remove
if ! [[ $1 == 'remove' ]]; then
	symlink
fi
