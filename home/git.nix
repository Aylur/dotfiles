{pkgs, ...}: {
  programs.git = {
    enable = true;
    extraConfig = {
      color.ui = true;
      core.editor = "nvim";
      credential.helper = "store";
      github.user = "Aylur";
      push.autoSetupRemote = true;
    };
    userEmail = "k.demeter@protonmail.com";
    userName = "Aylur";
  };
  programs.ssh = {
    enable = true;
    addKeysToAgent = "yes";
  };
  services.ssh-agent = {
    enable = pkgs.stdenv.isLinux;
  };
}
