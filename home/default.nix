{
  pkgs,
  config,
  lib,
  ...
}: let
  home = "${config.home.homeDirectory}/Projects/dotfiles";
  ln = path: config.lib.file.mkOutOfStoreSymlink "${home}/${path}";
in {
  imports = [
    ./home-manager/browser.nix
    ./home-manager/dconf.nix
    ./home-manager/distrobox.nix
    ./home-manager/ghostty.nix
    ./home-manager/packages.nix
  ];

  home.packages = [
    (import ./nvim {inherit pkgs;})
  ];

  xdg.configFile = {
    "tmux".source = ln "home/tmux";
    "nvim".source = ln "home/nvim";
    "niri".source = ln "home/niri";
    "nushell/config.nu".source = ln "home/nushell/config.nu";

    "nushell/autoload/vendor.nu".text = let
      scripts = "${pkgs.nu_scripts}/share/nu_scripts";
    in ''
      source ${scripts}/custom-completions/git/git-completions.nu
      source ${scripts}/custom-completions/nix/nix-completions.nu
      source ${scripts}/custom-completions/cargo/cargo-completions.nu
      source ${scripts}/custom-completions/pnpm/pnpm-completions.nu
      source ${scripts}/custom-completions/npm/npm-completions.nu
      source ${scripts}/custom-completions/ssh/ssh-completions.nu
      source ${scripts}/custom-completions/docker/docker-completions.nu
      source ${scripts}/modules/formats/from-env.nu
      source ${scripts}/modules/formats/to-ini.nu
    '';

    "gtk-3.0/bookmarks".text = ''
      file://${config.home.homeDirectory}/Projects
      file://${config.home.homeDirectory}/Work
      file://${config.home.homeDirectory}/Desktop
      file://${config.home.homeDirectory}/Downloads
      file://${config.home.homeDirectory}/Documents
      file://${config.home.homeDirectory}/.config Config
      file://${config.home.homeDirectory}/Vault
      file://${config.home.homeDirectory}/Pictures
      file://${config.home.homeDirectory}/Music
      file://${config.home.homeDirectory}/Videos
    '';

    "git/config".text = lib.generators.toGitINI {
      core.editor = "nvim";
      core.pager = "bat";
      color.ui = true;
      credential.helper = "store";
      github.user = "Aylur";
      push.autoSetupRemote = true;
      pull.rebase = true;
      user.email = "k.demeter@protonmail.com";
      user.name = "Aylur";
    };
  };

  xdg.desktopEntries = {
    "nvim" = {
      name = "NeoVim";
      comment = "Edit text files";
      icon = "nvim";
      exec = "xterm -e nvim %F";
      categories = ["TerminalEmulator"];
      terminal = false;
      mimeType = ["text/plain"];
    };
    "vim" = {
      name = "Vim";
      noDisplay = true;
    };
  };

  home.file = {
    ".local/bin/lorem".source = ./scripts/lorem.nu;
    ".local/bin/screenshot".source = ./scripts/screenshot.nu;
    ".local/bin/blocks".source = ./scripts/blocks.nu;
    ".local/bin/gjsx".source = ./scripts/gjsx.nu;
    ".local/bin/box".source = ./scripts/box.nu;

    ".local/share/flatpak/overrides/global".text = let
      dirs = [
        "/nix/store:ro"
        "xdg-config/gtk-3.0:ro"
        "xdg-config/gtk-4.0:ro"
        "${config.xdg.dataHome}/icons:ro"
      ];
    in ''
      [Context]
      filesystems=${builtins.concatStringsSep ";" dirs}
    '';
  };
}
