{pkgs, ...}: let
  symlink = pkgs.writeShellScript "symlink" ''
    if [[ "$1" == "-r" ]]; then
      rm -rf "$HOME/.config/nvim"
      rm -rf "$HOME/.config/ags"
      rm -rf "$HOME/.config/wezterm"
    fi

    if [[ "$1" == "-a" ]]; then
      rm -rf "$HOME/.config/nvim"
      rm -rf "$HOME/.config/ags"
      rm -rf "$HOME/.config/wezterm"

      ln -s "$HOME/Projects/dotfiles/nvim" "$HOME/.config/nvim"
      ln -s "$HOME/Projects/dotfiles/ags" "$HOME/.config/ags"
      ln -s "$HOME/Projects/dotfiles/wezterm" "$HOME/.config/wezterm"
    fi
  '';
  nx-switch = pkgs.writeShellScriptBin "nx-switch" ''
    ${symlink} -r

    ${
      if pkgs.stdenv.isDarwin
      then "darwin-rebuild switch --flake . --impure"
      else "sudo nixos-rebuild switch --flake . --impure"
    }

    ${symlink} -a
  '';
in {
  home.packages = [nx-switch];
}
