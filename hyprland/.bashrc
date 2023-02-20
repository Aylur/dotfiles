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

alias db='distrobox'
alias arch='distrobox-enter Arch'
alias fedora='distrobox-enter Fedora'
alias és='ls'
#alias code='flatpak run com.visualstudio.code'
alias firefox='flatpak run org.mozilla.firefox'
alias nix-install='nix profile install --extra-experimental-features nix-command --extra-experimental-features flakes'
alias nix-remove='nix profile remove --extra-experimental-features nix-command --extra-experimental-features flakes'
alias nix-list='nix profile list --extra-experimental-features nix-command --extra-experimental-features flakes'
alias nix-run='nix run --extra-experimental-features nix-command --extra-experimental-features flakes'
PS1='\n╭\u@\e[01;92mhost\e[m \w\n╰\$ '

neofetch
