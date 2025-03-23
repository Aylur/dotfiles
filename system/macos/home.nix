{
  pkgs,
  config,
  ...
}: {
  imports = [
    ../../home/git.nix
    ../../home/lf.nix
    ../../home/nvim.nix
    ../../home/packages.nix
    ../../home/sh.nix
    ../../home/starship.nix
    ../../home/tmux.nix
    ../../home/ghostty.nix
  ];

  news.display = "show";

  shellAliases = {
    "pr" = "poetry run";
    "prpm" = "poetry run python3 manage.py";
  };

  programs.nushell.extraEnv = ''
    $env.PATH = ($env.PATH | split row (char esep)
      | append "/usr/local/bin"
      | append "${config.home.homeDirectory}/.nix-profile/bin"
      | append "/nix/var/nix/profiles/default/bin")
  '';

  fonts.fontconfig.enable = true;

  home.packages = with pkgs.nerd-fonts; [
    ubuntu
    ubuntu-mono
    caskaydia-cove
  ];

  home.sessionVariables = {
    EDITOR = "nvim";
    SHELL = "${pkgs.nushell}/bin/nu";
    NIXPKGS_ALLOW_UNFREE = "1";
    NIXPKGS_ALLOW_INSECURE = "1";
    BAT_THEME = "base16";
    GOPATH = "${config.home.homeDirectory}/.local/share/go";
    GOMODCACHE = "${config.home.homeDirectory}/.cache/go/pkg/mod";
  };

  nix.settings = {
    experimental-features = ["nix-command" "flakes"];
    warn-dirty = false;
  };

  programs.home-manager.enable = true;
  home.stateVersion = "21.11";
}
