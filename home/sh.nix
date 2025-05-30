{
  pkgs,
  config,
  lib,
  ...
}: let
  aliases = {
    "db" = "distrobox";
    "tree" = "eza --tree";
    "nv" = "nvim";

    "ll" = "eza -la --sort name --group-directories-first --no-permissions --no-filesize --no-user --no-time";

    "éé" = "ls";
    "és" = "ls";
    "l" = "ls";

    ":q" = "exit";
    "q" = "exit";

    "gs" = "git status";
    "gc" = "git commit";
    "ga" = "git add";
    "gr" = "git reset --soft HEAD~1";

    "del" = "gio trash";
    "dev" = "nix develop -c nvim";
  };
in {
  options.shellAliases = with lib;
    mkOption {
      type = types.attrsOf types.str;
      default = {};
    };

  config.programs.zsh = {
    shellAliases = aliases // config.shellAliases;
    enable = true;
    enableCompletion = true;
    autosuggestion.enable = true;
    syntaxHighlighting.enable = true;
    initContent = ''
      SHELL=${pkgs.zsh}/bin/zsh
      zstyle ':completion:*' menu select
      bindkey "^[[1;5C" forward-word
      bindkey "^[[1;5D" backward-word
      unsetopt BEEP
    '';
  };

  config.programs.nushell = {
    shellAliases = aliases // config.shellAliases;
    enable = true;
    environmentVariables = {
      PROMPT_INDICATOR_VI_INSERT = "  ";
      PROMPT_INDICATOR_VI_NORMAL = "∙ ";
      PROMPT_COMMAND = "";
      PROMPT_COMMAND_RIGHT = "";
      NIXPKGS_ALLOW_UNFREE = "1";
      NIXPKGS_ALLOW_INSECURE = "1";
      SHELL = "${pkgs.nushell}/bin/nu";
      EDITOR = config.home.sessionVariables.EDITOR;
      VISUAL = config.home.sessionVariables.VISUAL;
    };
    extraConfig = let
      conf = builtins.toJSON {
        show_banner = false;
        edit_mode = "vi";

        ls.clickable_links = true;
        rm.always_trash = true;

        table = {
          mode = "compact"; # compact thin rounded
          index_mode = "always"; # always never auto
          header_on_separator = false;
        };

        cursor_shape = {
          vi_insert = "line";
          vi_normal = "block";
        };

        display_errors = {
          exit_code = false;
        };

        menus = [
          {
            name = "completion_menu";
            only_buffer_difference = false;
            marker = "? ";
            type = {
              layout = "columnar"; # list, description
              columns = 4;
              col_padding = 2;
            };
            style = {
              text = "magenta";
              selected_text = "blue_reverse";
              description_text = "yellow";
            };
          }
        ];
      };
      completions = let
        completion = name: ''
          source ${pkgs.nu_scripts}/share/nu_scripts/custom-completions/${name}/${name}-completions.nu
        '';
      in
        names:
          builtins.foldl'
          (prev: str: "${prev}\n${str}") ""
          (map completion names);
    in
      # nu
      ''
        $env.config = ${conf};
        ${completions ["git" "nix"]}

        source ${pkgs.nu_scripts}/share/nu_scripts/modules/formats/from-env.nu

        const path = "~/.nushellrc.nu"
        const null = "/dev/null"
        source (if ($path | path exists) {
            $path
        } else {
            $null
        })
      '';
    extraEnv =
      # nu
      ''
        $env.PATH = ($env.PATH | append "${config.home.homeDirectory}/.local/bin")
      '';
  };
}
