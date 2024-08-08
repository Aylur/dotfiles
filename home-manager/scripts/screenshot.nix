pkgs: let
  notify-send = "${pkgs.libnotify}/bin/notify-send";
  slurp = "${pkgs.slurp}/bin/slurp";
  wayshot = "${pkgs.wayshot}/bin/wayshot";
  swappy = "${pkgs.swappy}/bin/swappy";
  wl-copy = "${pkgs.wl-clipboard}/bin/wl-copy";
in
  pkgs.writeShellScriptBin "screenshot" ''
    SCREENSHOTS="$HOME/Pictures/Screenshots"
    NOW=$(date +%Y-%m-%d_%H-%M-%S)
    TARGET="$SCREENSHOTS/$NOW.png"

    mkdir -p $SCREENSHOTS

    if [[ -n "$1" ]]; then
        ${wayshot} -f $TARGET
    else
        selection=$(${slurp}) || exit 1
        ${wayshot} -f $TARGET -s "$selection"
    fi

    ${wl-copy} < $TARGET

    RES=$(${notify-send} \
        -a "Screenshot" \
        -i "image-x-generic-symbolic" \
        -h string:image-path:$TARGET \
        -A "file=Show in Files" \
        -A "view=View" \
        -A "edit=Edit" \
        "Screenshot Taken" \
        $TARGET)

    case "$RES" in
        "file") xdg-open "$SCREENSHOTS" ;;
        "view") xdg-open $TARGET ;;
        "edit") ${swappy} -f $TARGET ;;
        *) ;;
    esac
  ''
