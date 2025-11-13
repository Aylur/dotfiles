{pkgs, ...}: {
  home.packages = [pkgs.tmux];
  xdg.configFile."tmux".source = ../tmux;
}
