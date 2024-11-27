# home-manager fails to clone private repo after nix-collect-garbage
# nix build git+ssh://git@github.com/Aylur/my-shell
pkgs: {
  switch = pkgs.writeShellScriptBin "nx-switch" ''
    sudo nixos-rebuild switch --flake . --impure $@
  '';
  test = pkgs.writeShellScriptBin "nx-test" ''
    sudo nixos-rebuild test --flake . --impure $@
  '';
  gc = pkgs.writeShellScriptBin "nx-gc" ''
    nix-collect-garbage --delete-older-than 7d
    sudo nix-collect-garbage --delete-older-than 7d
  '';
}
