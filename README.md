# My Dotfiles

<img src="https://github.com/Aylur/dotfiles/blob/main/media/image.png">

## Extensions
- [Aylur's Widgets](https://extensions.gnome.org/extension/5338/aylurs-widgets/): it is up to you how you set it.
- [Floating Panel](https://extensions.gnome.org/extension/5514/floating-panel/): it is not necessary, though the theme is written for this extension.
- [Just Perfection](https://extensions.gnome.org/extension/3843/just-perfection/): for hiding stuff, and making the workspace switcher bigger and always visible.
- [Rounded Window Corners](https://extensions.gnome.org/extension/5237/rounded-window-corners/): best thing ever on Gnome.
- [User Themes](https://extensions.gnome.org/extension/19/user-themes/): self explanatory.

### Adding Background to workspace switcher

```css
//workspace switcher
/* */
.workspace-thumbnail{
  background-image: url("/home/demeter/.config/background");
  background-size: cover;
}

//battery bar padding
.battery-bar{
  padding-right: 3px;
}

//battery bar border
.level-bar{
  border: 2px solid black;
}
```
Add this into:

`~/.local/share./gnome-shell/extensions/user-theme@gnome-shell-extensions.gcampax.github.com/stylesheet.css`

### Color Scheme

Use [Gradience](https://flathub.org/apps/details/com.github.GradienceTeam.Gradience) for setting the color scheme to gtk apps.

I also recommend you to look into the theme source code and giving it your own scheme.
