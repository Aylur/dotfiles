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
      theme = "dark_plus";
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
      editor.lsp = {
        display-messages = true;
        # display-inline-hints = true;
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
}
