# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# User specific environment
if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]
then
    PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi

if ! [[ "$PATH" =~ "$HOME/.nix-profile/bin:" ]]
then
    PATH="$HOME/.nix-profile/bin:$PATH"
fi

export PATH
unset rc

nx() {
    flags="--extra-experimental-features nix-command --extra-experimental-features flakes"
      if [[ $1 == 'search' ]]; then nix search $flags nixpkgs#$2
    elif [[ $1 == 'run' ]]; then nix run $flags nixpkgs#$2
    elif [[ $1 == 'list' ]]; then nix profile list $flags
    elif [[ $1 == 'up' ]]; then nix profile $flags upgrade '.*'
    else nix profile $1 $flags nixpkgs#$2
    fi
}

alias db='distrobox'
alias arch='distrobox-enter Arch'
alias fedora='distrobox-enter Fedora'
alias és='ls'
alias code='flatpak run com.visualstudio.code'
alias firefox='flatpak run org.mozilla.firefox'
PS1='\n╭\u@\e[01;92mhost\e[m \w\n╰\$ '

neofetch
