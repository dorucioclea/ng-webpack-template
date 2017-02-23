# ng2-webpack-template

[![Build Status](https://travis-ci.org/DorianGrey/ng2-webpack-template.svg?branch=master)](https://travis-ci.org/DorianGrey/ng2-webpack-template)

This project provides a template for an [angular](https://angular.io/) project setup with [webpack](http://webpack.github.io).
It started as a companion of [ng2-jspm-template](https://github.com/flaviait/ng2-jspm-template), with the primary purpose to provide an almost identical codebase and feature set compared to its brother to make it easier to figure out which template fits better to the daily requirements of development with [angular](https://angular.io/).

## Setup

To start using this template, you might either
 - pick the latest release ([3.1.0](https://github.com/DorianGrey/ng2-webpack-template/releases/tag/3.1.0))
 - clone the repository directly for the most recent features and updates:


    git clone https://github.com/DorianGrey/ng2-webpack-template.git

You need to install a node.js version >= 6.9, since this project uses ES2015 language features, and we only support node versions from the most recent LTS upwards.
Things might work from 4.x upwards, but we do not provide any official support for this.

For users of [nvm](https://github.com/creationix/nvm), we're providing a `.nvmrc` file, so that you only need to execute:
```
nvm install
nvm use
```
We strongly recommend to use nvm (or any other node version manager of your choice).

The version favors to use [yarn](https://github.com/yarnpkg/yarn) for faster and more robust dependency management. To install it, just run
```
npm install -g yarn
```
Alternatively, you might use good old `npm`, if you REALLY want to. If that is the case, just replace the `yarn` part of the commands listed below with `npm`.

## Project structure
The intended project structure, how to work with it and possibly extend it is documented in the [docs folder](https://github.com/DorianGrey/ng2-webpack-template/tree/master/docs).

- [General structure](https://github.com/DorianGrey/ng2-webpack-template/blob/master/docs/general_structure.md)
- [The application state and how to extend it](https://github.com/DorianGrey/ng2-webpack-template/blob/master/docs/app_state.md)
- [The linters and why they are not tied to the webpack build](https://github.com/DorianGrey/ng2-webpack-template/blob/master/docs/linters.md)

## Workflow

### Development

Just run
```
yarn start
```
which will fire up a webpack-dev-server using webpack's DLL feature up-front to speed up everything, and provide HMR functionality. The latter is based on [ngrx/store](https://github.com/ngrx/store).


### Production

There are two ways to create a production build: The regular way, and a slightly more experimental one which includes [AoT compilation](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html) using the corresponding [webpack plugin](https://github.com/angular/angular-cli/blob/master/packages/webpack/README.md).

For the regular way, just run
```
yarn run dist
```
which will create a production build in the `dist` folder.

For the AoT-based, run
```
yarn run dist:aot
```
which will create a production build in the `dist-aot` folder.

By default, both versions are utilizing the [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer), which is available at `http://localhost:5000` after the build completed.
Alternatively, both versions can be executed with `dist-server` instead of just `dist` to start an exemplary production server (see the `example-dist-server` for details) be able to have a look at the build results immediately.

**Beware**: I did not call this way _experimental_ for no reason. The whole AoT processing currently enforces rather strict rules (see a rather good explanation [here](https://medium.com/@isaacplmann/making-your-angular-2-library-statically-analyzable-for-aot-e1c6f3ebedd5)) on how not only your own code has to be written, but also the code of the libraries you are using. Before you consider using AoT optimization, you will have to check if all your libraries support it.

Since some of these restrictions are caused by the lack of maturity of the AoT compiler ("just not implemented yet"), I'd describe both the AoT compiler itself and the corresponding plugin as _experimental_. **Don't get me wrong**: In case it works and passes the whole compilation process, the results are working fine, but there still is a rather high probability that you hit a case where you can't adopt your code to conform to the required restrictions.

You should also keep an eye on the list of [issues marked as related to it](https://github.com/angular/angular-cli/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20aot). Esp. [this](https://github.com/angular/angular-cli/issues/2799) is somewhat annoying if you want to integrate libraries that use custom decorators (as a workaround, no decorators are stripped atm., so the resulting bundle is larger), like [ngrx/effects](https://github.com/ngrx/effects).

