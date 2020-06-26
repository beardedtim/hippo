# hippo

> A 0 dependency Multi-Page Application Framework

## Overview

Right now, `hippo` doesn't do much. It can `log` some things to files and stdout, it can
serve files, and you can add middleware to the server.

You can find all of the modules we have created inside of `node_modules/@`. We are using the
Node module resolution algorithm to allow us to import/require our modules without having to
worry about folder structure for now.

Since we are not using _any_ dependecies that we did not write, we are _not_ `gitignore`-ing the
`node_modules` folder. 