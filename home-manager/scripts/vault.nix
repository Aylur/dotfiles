{pkgs, ...}: let
  vault = pkgs.writeShellScriptBin "vault" ''
    cd ~/Vault
    git add .
    git commit -m "sync $(date '+%Y-%m-%d %H:%M')"
    git push
  '';
in {
  home.packages = [vault];
}
