let
  aliases = {
    "db" = "distrobox";
    "arch" = "distrobox-enter Arch -- zsh";
    "fedora" = "distrobox-enter Fedora -- zsh";
    "eza" = "eza -l --sort type --no-permissions --no-user --no-time --header --icons --no-filesize --group-directories-first";
    "tree" = "eza --tree";
    "ll" = "eza";
    "éé" = "eza";
    "és" = "eza";
    "l" = "eza";
    "nv" = "nvim";
    ":q" = "exit";
    "q" = "exit";
    "gs" = "git status";
    "gb" = "git branch";
    "gch" = "git checkout";
    "gc" = "git commit";
    "ga" = "git add";
    "gr" = "git reset --soft HEAD~1";
    "vault" = "ga . && gc -m \"sync $(date '+%Y-%m-%d %H:%M')\" && git push";
    "f" = ''fzf --preview "bat --color=always --style=numbers --line-range=:500 {}"'';
    "rm" = "gio trash";
  };
in
{ 
  programs = {
    thefuck.enable = true;

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

    # nushell = {
    #   enable = true;
    #   shellAliases = aliases;
    #   extraConfig = ''
    #     $env.config = {
    #       show_banner: false,
    #     }
    #   '';
    # };
  };
}
