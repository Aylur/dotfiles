{
  boot.supportedFilesystems = [ "ntfs" ];

  boot.loader = {
    timeout = 3;
    systemd-boot.enable = true;
    efi.canTouchEfiVariables = true;
  };
}
