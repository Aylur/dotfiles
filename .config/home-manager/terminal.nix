{ pkgs, ... }:
let
  aliases = {
    "db" = "distrobox";
    "arch" = "distrobox-enter Arch -- zsh";
    "fedora" = "distrobox-enter Fedora -- zsh";
    "exa" = "exa -l --sort type --no-permissions --no-user --no-time --header --icons --no-filesize --group-directories-first";
    "ll" = "exa";
    "és" = "exa";
    "l" = "exa";
    "nv" = "nvim";
    ":q" = "exit";
    "q" = "exit";
    "gs" = "git status";
    "gb" = "git branch";
    "gch" = "git checkout";
    "gc" = "git commit";
    "ga" = "git add";
    "gr" = "git reset --soft HEAD~1";
  };
  tmux-theme = pkgs.tmuxPlugins.mkTmuxPlugin {
    pluginName = "charmful";
    version = "unstable-2024-09-04";
    src = pkgs.fetchzip {
      sha256 = "sha256-tNbJwDgJg601nyBxo9TV1DNU3RO7jV7V6DqVMpNUl4g=";
      url = "https://github.com/Aylur/tmux-charmful/archive/refs/heads/main.zip";
    };
  };
in
{ 
  programs = {
    zsh = {
      enable = true;
      enableCompletion = true;
      enableAutosuggestions = true;
      syntaxHighlighting.enable = true;
      initExtra = ''
        zstyle ':completion:*' menu select
        bindkey "^[[1;5C" forward-word
        bindkey "^[[1;5D" backward-word
      '';
      shellAliases = aliases;
    };
    bash = {
      enable = true;
      shellAliases = aliases;
    };
    nushell = {
      enable = true;
      shellAliases = aliases;
      extraConfig = ''
        $env.config = {
          show_banner: false,
        }
      '';
    };
  };

  home.packages = with pkgs; [
    wezterm
  ];

  xdg.desktopEntries."org.wezfurlong.wezterm" = {
    name = "WezTerm";
    comment = "Wez's Terminal Emulator";
    icon = "org.wezfurlong.wezterm";
    exec = "${pkgs.nixgl.nixGLIntel}/bin/nixGLIntel ${pkgs.wezterm}/bin/wezterm start --cwd .";
    categories = [ "System" "TerminalEmulator" "Utility" ];
    terminal = false;
  };

  programs.tmux = {
    enable = true;
    plugins = with pkgs.tmuxPlugins; [
      tmux-theme
      battery
      vim-tmux-navigator
      yank
    ];
    prefix = "C-Space";
    baseIndex = 1;
    escapeTime = 0;
    keyMode = "vi";
    mouse = true;
    shell = "${pkgs.zsh}/bin/zsh";
    extraConfig = ''
      set-option -sa terminal-overrides ",xterm*:Tc"
      bind v copy-mode
      bind-key -T copy-mode-vi v send-keys -X begin-selection
      bind-key -T copy-mode-vi C-v send-keys -X rectangle-toggle
      bind-key -T copy-mode-vi y send-keys -X copy-selection-and-cancel
      bind '"' split-window -v -c "#{pane_current_path}"
      bind % split-window -h -c "#{pane_current_path}"
    '';
  };
}
