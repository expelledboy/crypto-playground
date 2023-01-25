with (import <nixpkgs> { });

mkShell {
  buildInputs = [
    which
    jdk
    nodejs
    nodePackages.yarn
  ];

  shellHook = ''
    export PATH=$NPM_CONFIG_PREFIX/bin:$PATH
    test -d node_modules || yarn install
    which expo || yarn global add expo-cli
    which firebase || yarn global add firebase-tools
  '';
}
