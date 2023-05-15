{
  programs = {
    zsh = {
      enable = true;
      enableCompletion = true;
      enableAutosuggestions = true;
      enableSyntaxHighlighting = true;
      initExtra = ''
        zstyle ':completion:*' menu select
        bindkey "^[[1;5C" forward-word
        bindkey "^[[1;5D" backward-word
        nx() {
          if   [[ $1 == 'search' ]]; then nix search nixpkgs#$2
          elif [[ $1 == 'run' ]]; then nix run nixpkgs#$2
          elif [[ $1 == 'list' ]]; then nix profile list
          elif [[ $1 == 'install' ]]; then nix profile install nixpkgs#$2
          elif [[ $1 == 'up' ]]; then
            nix-channel --update
            nix-env --upgrade
            nix profile upgrade '.*'
            home-manager switch
          fi
        }
      '';
      shellAliases = {
        "db" = "distrobox";
        "a" = "distrobox-enter Arch";
        "f" = "distrobox-enter Fedora";
        "arch" = "a -- zsh";
        "fedora" = "f -- zsh";
        "cat" = "bat";
        "ls" = "exa -l --sort type --no-permissions --no-user --no-time --header --icons --no-filesize --group-directories-first";
        "és" = "ls";
        "ll" = "exa -l --sort type --header --icons --group-directories-first";
        "firefox" = "flatpak run org.mozilla.firefox";
        "nv" = "nvim";
        ":q" = "exit";
        "c" = "clear";
        "gs" = "git status";
        "gb" = "git branch";
        "gch" = "git checkout";
        "gc" = "git commit";
        "ga" = "git add";
        "gr" = "git reset --soft HEAD~1";
      };
    };
    bash = {
      enable = true;
      bashrcExtra = ''
        nx() {
          flags="--extra-experimental-features nix-command --extra-experimental-features flakes"
          if [[ $1 == 'search' ]]; then nix search $flags nixpkgs#$2
            elif [[ $1 == 'run' ]]; then nix run $flags nixpkgs#$2
            elif [[ $1 == 'list' ]]; then nix profile list $flags
            elif [[ $1 == 'up' ]]; then nix profile $flags upgrade '.*'
            elif [[ $1 == 'install' ]]; then nix profile install $flags nixpkgs#$2
          fi
        }
        alias db='distrobox'
        alias arch='distrobox-enter Arch'
        alias fedora='distrobox-enter Fedora'
        alias és='ls'
        alias c='clear'
        alias nv='nvim'
        alias :q='exit'
      '';
    };
  };
}
