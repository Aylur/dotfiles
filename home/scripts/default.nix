{pkgs ? import <nixpkgs> {}}: {
  screenshot = pkgs.writers.writeNuBin "screenshot" {
    makeWrapperArgs = with pkgs; [
      "--prefix PATH : ${lib.makeBinPath [
        libnotify
        slurp
        wayshot
        swappy
        wl-clipboard
      ]}"
    ];
  } (builtins.readFile ./screenshot.nu);

  lorem =
    pkgs.writers.writeNuBin "lorem" {}
    (builtins.readFile ./lorem.nu);

  gjsx =
    pkgs.writers.writeNuBin "gjsx" {}
    (builtins.readFile ./gjsx.nu);

  blocks =
    pkgs.writers.writeNuBin "blocks" {}
    (builtins.readFile ./blocks.nu);
}
