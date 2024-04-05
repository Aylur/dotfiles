{inputs, ...}: {
  imports = [inputs.stm.homeManagerModules.default];

  programs.stm = {
    enable = true;
    integrate = true;
    config = {
      print_details = false;
      color = {
        date = "magenta";
        header = "green";
        row_index = "red";
        separator = "blue";
        string = "white";
      };
      table = {
        header_on_separator = false;
        index_mode = "always";
        mode = "thin";
      };
    };
  };
}
