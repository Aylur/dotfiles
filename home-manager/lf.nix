{ inputs, ... }: {
  programs.lf = {
    enable = true;

    extraConfig = ''
      $mkdir -p ~/.trash
    '';

    commands = let
      trash = ''''${{
        set -f
        if gio trash 2>/dev/null; then
            gio trash $fx
        else
            mkdir -p ~/.trash
            mv -- $fx ~/.trash
        fi
      }}'';
    in {
      trash = trash;
      delete = trash;

      open = ''''${{
        case $(file --mime-type -Lb $f) in
            text/*) lf -remote "send $id \$$EDITOR \$fx";;
            *) for f in $fx; do $OPENER $f > /dev/null 2> /dev/null & done;;
        esac
      }}'';

      fzf = ''''${{
        res="$(find . -maxdepth 1 | fzf --reverse --header='Jump to location')"
        if [ -n "$res" ]; then
            if [ -d "$res" ]; then
                cmd="cd"
            else
                cmd="select"
            fi
            res="$(printf '%s' "$res" | sed 's/\\/\\\\/g;s/"/\\"/g')"
            lf -remote "send $id $cmd \"$res\""
        fi
      }}'';

      extract = ''''${{
        set -f
        case $f in
            *.tar.bz|*.tar.bz2|*.tbz|*.tbz2) tar xjvf $f;;
            *.tar.gz|*.tgz) tar xzvf $f;;
            *.tar.xz|*.txz) tar xJvf $f;;
            *.zip) unzip $f;;
            *.rar) unzip x $f;;
            *.7z) 7z x $f;;
        esac
      }}'';

      zip = ''''${{
        set -f
        mkdir $1
        cp -r $fx $1
        zip -r $1.zip $1
        rm -rf $1
      }}'';

      pager = ''
        $bat --paging=always "$f"
      '';

      on-select = ''&{{
        lf -remote "send $id set statfmt \"$(eza -ld --color=always "$f")\""
      }}'';
    };

    keybindings = {
      a = "push %mkdir<space>";
      t = "push %touch<space>";
      r = "push :rename<space>";
      "." = "set hidden!";
      "<delete>" = "trash";
      "<enter>" = "open";
      V = "pager";
      f = "fzf";
    };

    settings = {
      scrolloff = 4;
      preview = true;
      drawbox = true;
      icons = true;
      cursorpreviewfmt = "";
    };
  };

  xdg.configFile."lf/icons".source = inputs.lf-icons;
}
