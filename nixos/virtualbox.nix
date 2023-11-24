# FIXME: remove after uni
{
   virtualisation.virtualbox.host.enable = true;
   users.extraGroups.vboxusers.members = [ "demeter" ];
   nixpkgs.config.allowUnfree = true;
   programs.mininet.enable = true;

   nixpkgs.config.permittedInsecurePackages = [
     "python-2.7.18.7-env"
   ];
}
