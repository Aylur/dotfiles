{
  config,
  lib,
  ...
}: {
  options.asus = {
    enable = lib.mkEnableOption "Asus Laptop";
  };

  config = lib.mkIf config.asus.enable {
    # asusctl
    services.asusd = {
      enable = true;
      enableUserService = true;
    };

    # nvidia
    hardware.graphics = {
      enable = true;
      enable32Bit = true;
    };

    # openrgb
    services.hardware.openrgb.enable = true;

    # nvidia
    services.xserver.videoDrivers = ["nvidia"];

    hardware.nvidia = {
      prime = {
        offload.enable = true;
        offload.enableOffloadCmd = true;
        nvidiaBusId = "PCI:1:0:0";
        amdgpuBusId = "PCI:6:0:0";
      };

      modesetting.enable = true;

      powerManagement = {
        enable = true;
        finegrained = true;
      };

      open = true;
      nvidiaSettings = false; # gui app
      package = config.boot.kernelPackages.nvidiaPackages.production;
    };
  };
}
