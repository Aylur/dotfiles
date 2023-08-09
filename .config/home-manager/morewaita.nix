{ pkgs }:
pkgs.stdenv.mkDerivation {
  name = "MoreWaita-44.1";

  src = pkgs.fetchurl {
    url = "https://github.com/somepaulo/MoreWaita/archive/refs/tags/v44.1.zip";
    sha256 = "0k1ajfnx2jn3k300fb4lsjx8b4712wyvvx5fmzpjj7rx0jk75kkq";
  };

  dontUnpack = true;

  installPhase = ''
    mkdir -p $out
    ${pkgs.unzip}/bin/unzip $src -d $out
  '';
}
