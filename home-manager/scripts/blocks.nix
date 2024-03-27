{pkgs, ...}: let
  dark = "\\e[\${!j}\${i}m";
  bright = "\\e[9\${i}m";
  blocks = pkgs.writeShellScriptBin "blocks" ''
    f=3 b=4
    for j in f b; do
      for i in {0..7}; do
        printf -v $j$i %b "${dark}"
      done
    done
    for i in {0..7}; do
        printf -v fbright$i %b "${bright}"
    done
    d=$'\e[1m'
    t=$'\e[0m'
    v=$'\e[7m'

    2x4() {
    cat << EOF

     $f0████$d$fbright0▄$t  $f1████$d$fbright1▄$t  $f2████$d$fbright2▄$t  $f3████$d$fbright3▄$t
     $f0████$d$fbright0█$t  $f1████$d$fbright1█$t  $f2████$d$fbright2█$t  $f3████$d$fbright3█$t
     $f0████$d$fbright0█$t  $f1████$d$fbright1█$t  $f2████$d$fbright2█$t  $f3████$d$fbright3█$t
      $d$fbright0▀▀▀▀   $d$fbright1▀▀▀▀   $fbright2▀▀▀▀   $fbright3▀▀▀▀$t

     $f7████$d$fbright7▄$t  $f4████$d$fbright4▄$t  $f5████$d$fbright5▄$t  $f6████$d$fbright6▄$t
     $f7████$d$fbright7█$t  $f4████$d$fbright4█$t  $f5████$d$fbright5█$t  $f6████$d$fbright6█$t
     $f7████$d$fbright7█$t  $f4████$d$fbright4█$t  $f5████$d$fbright5█$t  $f6████$d$fbright6█$t
      $fbright7▀▀▀▀   $fbright4▀▀▀▀   $fbright5▀▀▀▀   $fbright6▀▀▀▀$t

    EOF
    }

    1x6() {
    cat << EOF

     $f1████$d$fbright1▄$t  $f2████$d$fbright2▄$t  $f3████$d$fbright3▄$t  $f4████$d$fbright4▄$t  $f5████$d$fbright5▄$t  $f6████$d$fbright6▄$t
     $f1████$d$fbright1█$t  $f2████$d$fbright2█$t  $f3████$d$fbright3█$t  $f4████$d$fbright4█$t  $f5████$d$fbright5█$t  $f6████$d$fbright6█$t
     $f1████$d$fbright1█$t  $f2████$d$fbright2█$t  $f3████$d$fbright3█$t  $f4████$d$fbright4█$t  $f5████$d$fbright5█$t  $f6████$d$fbright6█$t
      $d$fbright1▀▀▀▀   $fbright2▀▀▀▀   $fbright3▀▀▀▀$t   $fbright4▀▀▀▀   $fbright5▀▀▀▀   $fbright6▀▀▀▀$t

    EOF
    }

    1x8() {
    cat << EOF

     $f1████$d$fbright1▄$t  $f2████$d$fbright2▄$t  $f3████$d$fbright3▄$t  $f4████$d$fbright4▄$t  $f5████$d$fbright5▄$t  $f6████$d$fbright6▄$t  $f7████$d$fbright7▄$t  $f0████$d$fbright0▄$t
     $f1████$d$fbright1█$t  $f2████$d$fbright2█$t  $f3████$d$fbright3█$t  $f4████$d$fbright4█$t  $f5████$d$fbright5█$t  $f6████$d$fbright6█$t  $f7████$d$fbright7█$t  $f0████$d$fbright0█$t
     $f1████$d$fbright1█$t  $f2████$d$fbright2█$t  $f3████$d$fbright3█$t  $f4████$d$fbright4█$t  $f5████$d$fbright5█$t  $f6████$d$fbright6█$t  $f7████$d$fbright7█$t  $f0████$d$fbright0█$t
      $d$fbright1▀▀▀▀   $fbright2▀▀▀▀   $fbright3▀▀▀▀$t   $fbright4▀▀▀▀   $fbright5▀▀▀▀   $fbright6▀▀▀▀$t   $fbright7▀▀▀▀$t   $fbright0▀▀▀▀$t

    EOF
    }

    case $1 in
    	4)	2x4;;
    	6)	1x6;;
    	8)	1x8;;
    	*)  1x6;;
    esac
  '';
in {
  home.packages = [blocks];
}
