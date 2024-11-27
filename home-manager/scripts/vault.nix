pkgs:
pkgs.writeShellScriptBin "vault" ''
  cd ~/Vault
  git add .
  git commit -m "sync $(date '+%Y-%m-%d %H:%M')"
  git push
''
