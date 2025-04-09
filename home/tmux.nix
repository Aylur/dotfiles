{pkgs, ...}: let
  accent = "#{@main_accent}";

  indicator = let
    accent = "#{@indicator_color}";
    left = "#[noreverse]#{?client_prefix,,}";
    right = "#[noreverse]#{?client_prefix, ,}";
    icon = "#[reverse]#{?client_prefix,,}";
  in "#[fg=${accent}]${left}${icon}${right}";

  current_window = let
    style = "#[bold,fg=${accent}]";
    reset = "#[bold,fg=default]";
  in "${style}#I[${reset}#W${style}] ";

  window_status = let
    style = "#[none]";
    content = "#I #W  ";
  in "${style}${content}";

  time = let
    format = "%H:%M";
    icon = pkgs.writers.writeNu "icon" ''
      [ 󱑖 󱑋 󱑌 󱑍 󱑎 󱑏 󱑐 󱑑 󱑒 󱑓 󱑔 󱑕 ]
      | get ((date now | into record | get hour) mod 12)
    '';
  in " #[fg=${accent}]#(${icon}) #[bold,fg=default]${format}";

  battery = let
    percentage = pkgs.writeShellScript "percentage" (
      if pkgs.stdenv.isDarwin
      then ''
        echo $(pmset -g batt | grep -o "[0-9]\+%" | tr '%' ' ')
      ''
      else ''
        path="/org/freedesktop/UPower/devices/DisplayDevice"
        echo $(${pkgs.upower}/bin/upower -i $path | grep -o "[0-9]\+%" | tr '%' ' ')
      ''
    );
    state = pkgs.writeShellScript "state" (
      if pkgs.stdenv.isDarwin
      then ''
        echo $(pmset -g batt | awk '{print $4}')
      ''
      else ''
        path="/org/freedesktop/UPower/devices/DisplayDevice"
        echo $(${pkgs.upower}/bin/upower -i $path | grep state | awk '{print $2}')
      ''
    );
    icon = pkgs.writeShellScript "icon" ''
      percentage=$(${percentage})
      state=$(${state})
      if [ "$state" == "charging" ] || [ "$state" == "fully-charged" ]; then echo "󰂄"
      elif [ $percentage -ge 75 ]; then echo "󱊣"
      elif [ $percentage -ge 50 ]; then echo "󱊢"
      elif [ $percentage -ge 25 ]; then echo "󱊡"
      elif [ $percentage -ge 0  ]; then echo "󰂎"
      fi
    '';
    color = pkgs.writeShellScript "color" ''
      percentage=$(${percentage})
      state=$(${state})
      if [ "$state" == "charging" ] || [ "$state" == "fully-charged" ]; then echo "green"
      elif [ $percentage -ge 75 ]; then echo "green"
      elif [ $percentage -ge 50 ]; then echo "default"
      elif [ $percentage -ge 30 ]; then echo "yellow"
      elif [ $percentage -ge 0  ]; then echo "red"
      fi
    '';
  in "#[fg=#(${color})]#(${icon}) #[fg=default]#(${percentage})%";

  pwd = let
    icon = "#[fg=${accent}] ";
    format = "#[fg=default]#{b:pane_current_path}";
  in "${icon}${format}";

  git = let
    icon = pkgs.writeShellScript "branch" ''
      git -C "$1" branch && echo " "
    '';
    branch = pkgs.writeShellScript "branch" ''
      git -C "$1" rev-parse --abbrev-ref HEAD
    '';
  in "#[fg=#{@git_branch}]#(${icon} #{pane_current_path})#(${branch} #{pane_current_path})";
in {
  programs.tmux = {
    enable = true;
    plugins = with pkgs.tmuxPlugins; [
      vim-tmux-navigator
      yank
    ];
    prefix = "C-Space";
    baseIndex = 1;
    escapeTime = 0;
    keyMode = "vi";
    mouse = true;
    shell = "${pkgs.nushell}/bin/nu";
    extraConfig = ''
      set-option -sa terminal-overrides ",xterm*:Tc"
      bind v copy-mode
      bind-key -T copy-mode-vi v send-keys -X begin-selection
      bind-key -T copy-mode-vi C-v send-keys -X rectangle-toggle
      bind-key -T copy-mode-vi y send-keys -X copy-selection-and-cancel
      bind-key b set-option status
      bind '"' split-window -v -c "#{pane_current_path}"
      bind % split-window -h -c "#{pane_current_path}"

      set-option -g focus-events on
      set-option -g default-terminal "screen-256color"
      set-option -g status-right-length 100
      set-option -g @indicator_color "yellow"
      set-option -g @main_accent "blue"
      set-option -g @git_branch "magenta"
      set-option -g pane-active-border fg=black
      set-option -g pane-border-style fg=black
      set-option -g status-style "bg=default fg=default"
      set-option -g status-left "${indicator}"
      set-option -g status-right "${git}  ${pwd}  ${battery} ${time}"
      set-option -g window-status-current-format "${current_window}"
      set-option -g window-status-format "${window_status}"
      set-option -g window-status-separator ""
    '';
  };
}
