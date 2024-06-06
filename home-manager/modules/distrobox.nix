{
  pkgs,
  config,
  lib,
  ...
}: let
  inherit (lib) types;
  inherit (lib.modules) mkIf;
  inherit (lib.options) mkOption mkEnableOption;

  cfg = config.programs.distrobox;
in {
  options.programs.distrobox = {
    enable = mkEnableOption "distrobox";
    boxes = mkOption {
      type = types.attrs;
      default = {};
    };
  };

  config = let
    boxes = mkBoxes cfg.boxes;

    mkBoxes = let
      mkBox = name: {
        img,
        home ? ".local/share/distrobox/${name}",
        packages ? "git neovim",
        init ? "true",
        flags ? "",
        path ? [],
        nixPackages ? [],
        symlinks ? [],
        alias ? lib.strings.toLower name,
        exec ? "bash",
      }: {
        inherit home img flags packages alias symlinks exec;
        init = pkgs.writeShellScript "init" init;
        path =
          path
          ++ [
            "/bin"
            "/sbin"
            "/usr/bin"
            "/usr/sbin"
            "/usr/local/bin"
            "$HOME/.local/bin"
          ]
          ++ (map (p: "${p}/bin") nixPackages);
      };
    in
      attrs:
        builtins.attrValues
        (builtins.mapAttrs mkBox attrs);

    mkBoxLinks = box: let
      ln = config.lib.file.mkOutOfStoreSymlink;
    in
      builtins.listToAttrs (map (link: {
          name = "${box.home}/${link}";
          value = {
            source = ln "${config.home.homeDirectory}/${link}";
          };
        })
        box.symlinks);

    mkBoxAlias = box: let
      db = "${pkgs.distrobox}/bin/distrobox";
      exec = pkgs.writeShellScript "db-exec" ''
        data_dirs=()
        IFS=':'
        read -ra segments <<<"$XDG_DATA_DIRS"
        for segment in "''${segments[@]}"; do
          if [[ $segment != *"/nix"* ]]; then
            data_dirs+=("$segment")
          fi
        done

        export XDG_DATA_DIRS="''${data_dirs[*]}"
        export PATH="${builtins.concatStringsSep ":" box.path}"
        ${box.exec}
      '';
    in
      pkgs.writeShellScriptBin box.alias ''
        if ! ${db} list | grep ${box.alias}; then
           ${db} create ${box.flags} \
             --pull \
             --yes \
             --name "${box.alias}" \
             --home "${config.home.homeDirectory}/${box.home}" \
             --image "${box.img}" \
             --init-hooks "${box.init}" \
             --additional-packages "${box.packages}"
        fi

        if [ $# -eq 0 ]; then
          ${db} enter ${box.alias} -- ${exec}
        else
          ${db} enter ${box.alias} -- $@
        fi
      '';
  in
    mkIf cfg.enable {
      home.packages = [pkgs.distrobox] ++ (map mkBoxAlias boxes);
      home.file = builtins.foldl' (acc: x: acc // x) {} (map mkBoxLinks boxes);
    };
}
