pkgs: {
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

  box = pkgs.writers.writeNu "box" {
    makeWrapperArgs = with pkgs; [
      "--prefix PATH : ${pkgs.lib.makeBinPath [distrobox]}"
    ];
  } (builtins.readFile ./distrobox.nu);

  lorem =
    pkgs.writers.writeNuBin "lorem" {}
    (builtins.readFile ./lorem.nu);

  blocks =
    pkgs.writers.writeNuBin "blocks" {}
    (builtins.readFile ./blocks.nu);
}
