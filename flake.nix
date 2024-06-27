{

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.05";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    { self
    , nixpkgs
    , systems
    , ...
    } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = forEachSystem
        (system:
          let
            pkgs = import nixpkgs {
              system = system;
              config.allowUnfree = true;
            };
          in
          {
            default = pkgs.mkShell {

              NIX_PATH = "nixpkgs=" + pkgs.path;

              shellHook = ''
                WSLENV=$WSLENV:PATH
              '';
              
              buildInputs = with pkgs;[
                nodejs_20
                sqlite
                dbeaver-bin
              ];              

            };
          });

    };

}
