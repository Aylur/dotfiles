{ inputs
, system
, stdenv
, writeShellScript
, writeShellScriptBin
, cage
, swww
, bun
, dart-sass
, fd
, brightnessctl
, accountsservice
, slurp
, wf-recorder
, wl-clipboard
, wayshot
, swappy
, hyprpicker
, pavucontrol
, networkmanager
}:
let
  ags = inputs.ags.packages.${system}.default.override {
    extraPackages = [accountsservice];
  };

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

      ${bun}/bin/bun build ./greeter/greeter.ts \
        --outfile greeter.js \
        --external "resource://*" \
        --external "gi://*"
    '';

    installPhase = ''
      mkdir $out
      cp -r assets $out
      cp -r style $out
      cp -r greeter $out
      cp -r widget $out
      cp -f main.js $out/config.js
      cp -f greeter.js $out/greeter.js
    '';
  };

  addBins = list: builtins.concatStringsSep ":" (builtins.map (p: "${p}/bin") list);
in {
  inherit config;
  greeter = { layout, cursor }: writeShellScript "greeter" ''
    export XKB_DEFAULT_LAYOUT=${layout}
    export XCURSOR_THEME=${cursor}
    export PATH=$PATH:${dart-sass}/bin
    export PATH=$PATH:${fd}/bin
    ${cage}/bin/cage -ds -m last ${ags}/bin/ags -- -c ${config}/greeter.js
  '';
  asztal = writeShellScriptBin pname ''
    export PATH=$PATH:${addBins [
      dart-sass
      fd
      brightnessctl
      swww
      inputs.matugen.packages.${system}.default
      slurp
      wf-recorder
      wl-clipboard
      wayshot
      swappy
      hyprpicker
      pavucontrol
      networkmanager
    ]}
    ${ags}/bin/ags -b ${pname} -c ${config}/config.js $@
  '';
}

