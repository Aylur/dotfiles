{ lib, ... }:
{
  programs.starship = {
    enable = true;
    settings = {
      format = lib.strings.concatStrings [
        "$nix_shell"
        "$os"
        "$directory"
        "$status"
        "$character"
      ];
      right_format = lib.strings.concatStrings [
        "$cmd_duration"
        "$git_branch $git_status"
        "$python"
        "$nodejs"
        "$lua"
        "$rust"
        "$java"
        "$c"
        "$golang"
      ];
      status = {
        symbol = "✗";
        not_found_symbol = "󰍉 Not Found";
        not_executable_symbol = " Can't Execute E";
        sigint_symbol = "󰂭 ";
        signal_symbol = "󱑽 ";
        success_symbol = "";
        format = "[ $symbol ](fg:red)";
        map_symbol = true;
        disabled = false;
      };
      cmd_duration = {
        min_time = 1000;
        format = "[ $duration](fg:yellow)";
      };
      character = {
        success_symbol = "[❯](bold green)";
        error_symbol = "[](bold red)";
      };
      nix_shell = {
        disabled = false;
        format = " [](fg:white)[ ](bg:white fg:black)[](fg:white)";
      };
      directory = {
        format = " [](fg:black)[$path](bg:black fg:#f1f1f1)[](fg:black)";
        # format = "[$path](bg:black fg:#f1f1f1)[](fg:black)";
        truncation_length = 4;
        truncation_symbol = "~/…/";
      };
      directory.substitutions = {
        "Documents" = " ";
        "Downloads" = " ";
        "Music" = " ";
        "Pictures" = " ";
        "Videos" = " ";
        "Projects" = "󱌢 ";
        "School" = "󰑴 ";
        "GitHub" = "";
        ".config" = " ";
      };
      git_branch = {
        symbol = "";
        style = "";
        format = "[ $symbol](bright-black) $branch(:$remote_branch)";
      };
      os = {
        disabled = false;
        format = " [](fg:blue)[$symbol](bg:blue fg:black)[](fg:blue)";
      };
      os.symbols = {
        Arch = " ";
        Debian = " ";
        EndeavourOS = " ";
        Fedora = " ";
        NixOS = " ";
        openSUSE = " ";
        SUSE = " ";
      };
      python = {
        symbol = "";
        format = "[$symbol](yellow)";
      };
      nodejs = {
        symbol = " ";
        format = "[$symbol](yellow)";
      };
      lua = {
        symbol = "󰢱";
        format = "[$symbol](blue)";
      };
      rust = {
        symbol = "";
        format = "[$symbol](red)";
      };
      java = {
        symbol = "";
        format = "[$symbol](white)";
      };
      c = {
        symbol = "";
        format = "[$symbol](blue)";
      };
      golang = {
        symbol = "";
        format = "[$symbol](bright-blue)";
      };
    };
  };
}
