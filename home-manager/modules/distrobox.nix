{
  pkgs,
  config,
  lib,
  ...
}: let
  inherit (lib) types;
  inherit (lib.modules) mkIf;
  inherit (lib.options) mkOption mkEnableOption;
  inherit (builtins) concatStringsSep filter attrValues mapAttrs typeOf;

  boxScript = (import ../../scripts pkgs).box;
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
    mkBoxes = let
      mkBox = name: {
        image,
        exec ? "bash",
        home ? ".local/share/distrobox/${name}",
        packages ? ["git" "neovim"],
        init ? "true",
      }: {
        inherit name home image exec;
        packages = concatStringsSep " " (filter (p: typeOf p == "string") packages);
        init = pkgs.writeShellScript "init" init;
        path =
          [
            "/bin"
            "/sbin"
            "/usr/bin"
            "/usr/sbin"
            "/usr/local/bin"
            "$HOME/.local/bin"
          ]
          ++ (map (p: "${p}/bin") (filter (p: typeOf p == "set") packages));
      };
    in
      attrs: attrValues (mapAttrs mkBox attrs);

    mkBoxAlias = box: let
      exec = pkgs.writeShellScript "db-exec" ''
        export XDG_DATA_DIRS="/usr/share:/usr/local/share"
        export PATH="${builtins.concatStringsSep ":" box.path}"
        if [ $# -eq 0 ]; then ${box.exec}; else bash -c "$@"; fi
      '';
    in
      pkgs.writeShellScriptBin box.name ''
        ${boxScript} ${box.name} ${box.image} ${exec} $@ \
          --home "${config.home.homeDirectory}/${box.home}" \
          --pkgs "${box.packages}" \
          --init "${box.init}"
      '';

    boxes = mkBoxes cfg.boxes;
  in
    mkIf cfg.enable {
      home.packages = [pkgs.distrobox] ++ (map mkBoxAlias boxes);
    };
}
