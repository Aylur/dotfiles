{pkgs, ...}: let
  nvim = import ../nvim {inherit pkgs;};
  nu_scripts = "${pkgs.nu_scripts}/share/nu_scripts";
in {
  home.packages = [
    nvim
    pkgs.tmux
    pkgs.nushell
    pkgs.starship

    pkgs.bat
    pkgs.eza
    pkgs.fd
    pkgs.ripgrep
    pkgs.fzf
    pkgs.lazydocker
    pkgs.lazygit
    pkgs.btop
  ];

  programs.zsh = {
    enable = true;
    enableCompletion = true;
    autosuggestion.enable = true;
    syntaxHighlighting.enable = true;
    initContent = ''
      zstyle ':completion:*' menu select
      bindkey "^[[1;5C" forward-word
      bindkey "^[[1;5D" backward-word
      unsetopt BEEP
    '';
  };

  xdg.configFile = {
    "nushell/config.nu".source = ../nushell/config.nu;
    "nushell/autoload/completions.nu".text = ''
      source ${nu_scripts}/custom-completions/git/git-completions.nu
      source ${nu_scripts}/custom-completions/nix/nix-completions.nu
    '';
    "tmux".source = ../tmux;
    "nvim".source = ../nvim;
  };

  xdg.desktopEntries."nvim" = {
    name = "NeoVim";
    comment = "Edit text files";
    icon = "nvim";
    exec = "xterm -e ${nvim}/bin/nvim %F";
    categories = ["TerminalEmulator"];
    terminal = false;
    mimeType = ["text/plain"];
  };

  xdg.desktopEntries."vim" = {
    name = "Vim";
    noDisplay = true;
  };

  programs.git = {
    enable = true;
    extraConfig = {
      color.ui = true;
      core.editor = "nvim";
      credential.helper = "store";
      github.user = "Aylur";
      push.autoSetupRemote = true;
    };
    userEmail = "k.demeter@protonmail.com";
    userName = "Aylur";
  };

  programs.ssh = {
    enable = true;
    addKeysToAgent = "yes";
  };

  services.ssh-agent = {
    enable = pkgs.stdenv.isLinux;
  };
}
