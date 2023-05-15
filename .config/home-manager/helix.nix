{ pkgs, ... }:
{
  programs.helix = {
    enable = true;
    languages = [
      {
        name = "java";
        language-server = {
          command = "jdtls";
          args = ["-data" "/home/my_user/.cache/jdtls/my_project"];
        };
      }
    ];
    settings = {
      theme = "base16_transparent";
      editor = {
        line-number = "absolute";
        color-modes = true;
        bufferline = "multiple";
      };
      editor.statusline = {
        left = ["mode" "spinner"];
        center = [];
        right = ["diagnostics" "spacer" "selections" "position" "spacer" "file-encoding" "file-line-ending" "file-type"];
        separator = "│";
        mode.normal = "NORMAL";
        mode.insert = "INSERT";
        mode.select = "SELECT";
      };
      keys.normal = {
        esc = [ "collapse_selection" "keep_primary_selection" ];
      };
      editor.lsp = {
        display-messages = true;
      };
      editor.cursor-shape = {
        normal = "block";
        insert = "bar";
        select = "bar";
      };
      editor.file-picker = {
        hidden = false;
      };
      editor.search = {
        smart-case = false;
      };
      editor.indent-guides = {
        render = true;
        character = "┊";
        skip-levels = 0;
      };
    };
  };
 
  home.packages = with pkgs; [
    llvmPackages_9.libclang
    nodePackages.bash-language-server
    nodePackages.vscode-langservers-extracted
    nodePackages.svelte-language-server
    nodePackages.vls
    jdt-language-server
    lua-language-server
    marksman
    rnix-lsp
    rust-analyzer
    gopls
  ];
}
