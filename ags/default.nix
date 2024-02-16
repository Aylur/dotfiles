{ inputs
, system
, stdenv
, writeShellScriptBin
, swww
, bun
, dart-sass
, brightnessctl
}:
let
  ags = inputs.ags.packages.${system}.default;
  pname = "asztal";
  config = stdenv.mkDerivation {
    inherit pname;
    version = "1.7.6";
    src = ./.;

    buildPhase = ''
      ${bun}/bin/bun build ./main.ts \
        --outfile main.js \
        --external "resource://*" \
        --external "gi://*"
    '';

    installPhase = ''
      mkdir $out
      cp -r assets $out
      cp -r style $out
      cp -f main.js $out/config.js
    '';
  };
in {
  inherit config;
  script = writeShellScriptBin pname ''
    export PATH=$PATH:${dart-sass}/bin
    export PATH=$PATH:${brightnessctl}/bin
    export PATH=$PATH:${swww}/bin
    ${ags}/bin/ags -b ${pname} -c ${config}/config.js $@
  '';
}

