{
  pkgs,
  lib,
  ...
}: let
  turtle = with pkgs;
    python3.pkgs.buildPythonApplication rec {
      pname = "turtle";
      version = "0.7";

      src = fetchFromGitLab {
        domain = "gitlab.gnome.org";
        owner = "philippun1";
        repo = pname;
        rev = version;
        hash = "sha256-XmtlZJYBjv1yLLc//uPO86EhABIScJ1EAdZ2kFHmgSg=";
      };

      format = "setuptools";

      nativeBuildInputs = [
        wrapGAppsHook4
        gobject-introspection
      ];
      buildInputs = [
        libadwaita
        gtk4
        glib
      ];
      nativeCheckInputs = [
        cacert
      ];

      postInstall = ''
        install -Dm644 -t $out/share/nautilus-python/extensions $src/plugins/turtle_nautilus_flatpak.py
      '';

      # this runs after the wrapPythonScipts function, hence $program_PYTHONPATH is already populated.
      # the turtle_nautilus.py plugin imports turtlevcs, hence we have to patch it
      postFixup = ''
        patchPythonScript "$out/share/nautilus-python/extensions/turtle_nautilus_flatpak.py"
      '';

      propagatedBuildInputs =
        (with python3.pkgs; [
          pygit2
          pygobject3
          dbus-python
        ])
        ++ [
          meld
        ];

      preFixup = ''
        makeWrapperArgs+=("''${gappsWrapperArgs[@]}")
        # It can't find pygit2 without also adding $PYTHONPATH to the wrapper
        makeWrapperArgs+=( --prefix PYTHONPATH : $out/${python3.sitePackages}:$PYTHONPATH )
      '';

      dontWrapGApps = true;
      strictDeps = false;
    };
  nautEnv = pkgs.buildEnv {
    name = "nautilus-env";

    paths = with pkgs; [
      gnome.nautilus
      gnome.nautilus-python
      nautilus-open-any-terminal
      turtle
    ];
  };
in {
  environment = {
    systemPackages = [nautEnv];
    pathsToLink = [
      "/share/nautilus-python/extensions"
    ];
    sessionVariables = {
      NAUTILUS_4_EXTENSION_DIR = lib.mkDefault "${nautEnv}/lib/nautilus/extensions-4";
    };
  };
}
