with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    which
    jdk
    nodejs
    nodePackages.yarn
  ];

  NPM_CONFIG_PREFIX = builtins.toString ./.npm-packages;

  shellHook = ''
    test -d node_modules || yarn install
  '';

  postHook = ''
    export PATH=$NPM_CONFIG_PREFIX/bin:$PATH
    which expo || yarn global add expo-cli
    which firebase || yarn global add firebase-tools
  '';
}
