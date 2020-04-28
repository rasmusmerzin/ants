<h1 style='text-align: center'>An<img src='https://rasmusmerzin.github.io/static/media/TypeScript.a14d1459.svg' alt='TS' height='36px' /></h1>

Ants is a simple web application rendering dots (ants) which move avoiding the cursor and each other.

This project was created with [TypeScript](https://www.typescriptlang.org) [React](https://reactjs.org).
Trigonometric functions have tests created using [Jest](https://jestjs.io).

Ants is available at https://rasmusmerzin.github.io/ants.

## Table of contents
* [Setup](#Setup)
  * [Downloading and installing](#Downloading-and-installing)
  * [Running the app](#Running-the-app)
  * [Running tests](#Running-tests)
  * [Production build](#Production-build)
  * [GitHub pages](#GitHub-pages)
* [User interface](#User-interface)
* [Algorithm](#Algorithm)
* [Mathematics](#Mathematics)
  * [One neighbour in range](#One-neighbour-in-range)
  * [Multiple neighbours in range](#Multiple-neighbours-in-range)
  * [No neighbours in range](#No-neighbours-in-range)
* [Summary](#Summary)

## Setup

I used [Node.js](https://nodejs.org) 14.0.0 and [Yarn](https://classic.yarnpkg.com) 1.22.4 while developing this project.

> Note: I found out that with these versions of Node.js and Yarn and with node-sass versions 4.13.1 and 4.14.0 using CSS variables `var(--`*var*`)` in `calc()` functions compiles in development mode but throws an error during `react-scripts build`. In such cases I used Sass variables.

Module versions and scripts are available in [package.json](https://github.com/rasmusmerzin/ants/blob/master/package.json).

### Downloading and installing

Clone the git repository with `git clone https://github.com/rasmusmerzin/ants.git`.

Change working directory to ants with `cd ants`.

When Node.js and yarn or npm are installed one can install needed node modules with `yarn` or `npm install`.

### Running the app

When node modules are installed it is possible to run the app in development mode with `yarn start` or `npm start`.

Open http://localhost:3000 to view it in the browser.

More about development mode at [create-react-app.dev](https://create-react-app.dev/docs/available-scripts#npm-start).

### Running tests

To run tests `yarn test` or `npm test`.

More about running tests at [create-react-app.dev](https://create-react-app.dev/docs/available-scripts#npm-test).

### GitHub Pages

To deploy the app to GitHub Pages `yarn deploy` or `npm run deploy`.

Deploy script first creates the production build with `react-scripts build` with project root as [rasmusmerzin.github.io/ants](https://rasmusmerzin.github.io/ants) and removes source map files.
Then the build directory is uploaded to branch `gh-pages` at [github.com/rasmusmerzin/ants](https://github.com/rasmusmerzin/ants/tree/gh-pages) which is then served by github.

More about `react-app build` at [create-react-app.dev](https://create-react-app.dev/docs/available-scripts#npm-run-build).  
More about `gh-pages` at [npmjs.com](https://www.npmjs.com/package/gh-pages#command-line-utility).

## User interface

When the web page is opened 30 ants are drawn and updated 60 times per second.

Clicking and holding on the screen creates a highlight which ants are trying to avoid.
It also shows current distancing range.

In the top left corner there is hamburger icon which opens a menu to configure simulation settings.

## Algorithm

When the app [component is mounted](https://github.com/rasmusmerzin/ants/blob/845969b2c20dbbaa3daeb34032775f974dbfe9c7/src/App.tsx#L109-L113) 30 objects of class [Ant](https://github.com/rasmusmerzin/ants/blob/master/src/logic/Ant.ts) are randomly placed in the window space.

Additionally a [job is initialized](https://github.com/rasmusmerzin/ants/blob/845969b2c20dbbaa3daeb34032775f974dbfe9c7/src/App.tsx#L115-L124) which calculates a velocity and the new position depending on that velocity for each Ant object with an interval depending on the render rate ([state.renderRate](https://github.com/rasmusmerzin/ants/blob/845969b2c20dbbaa3daeb34032775f974dbfe9c7/src/App.tsx#L94)).

For each [Ant](https://github.com/rasmusmerzin/ants/blob/master/src/logic/Ant.ts) object a React component [Dot](https://github.com/rasmusmerzin/ants/blob/master/src/components/Dot.tsx) is [mapped](https://github.com/rasmusmerzin/ants/blob/845969b2c20dbbaa3daeb34032775f974dbfe9c7/src/App.tsx#L142-L147). They are kept in sync by React runtime.

## Mathematics

A velocity for each ant is calculated every frame depending on the count of peers in range.


### One peer in range

When there is another ant in distancing range **`R`** the a distancing push **`p`** will be calculated.
Distancing push is a vector with a direction opposite to the direction of the neighbouring ant and a length inversely proportional to the distance **`d`** of the same neighbouring ant.

When there is only one neighbour in range the velocity of the given ant is equal to it's neighbour's push vector.

<img src='./docs/diagram_01.svg' alt='diagram 1' />

`R` ‒ distancing range  
`k` ‒ distancing factor

`d` ‒ neighbour distance  
`p` ‒ distancing push

<img src='./docs/formula_01.svg' alt='p=k*R/d' />


### Multiple peers in range

When there are multiple neighbours in range the velocity of the given ant is equal to vector sum of it's neighbours' push vectors.

<img src='./docs/diagram_02.svg' alt='diagram 2' />

`n` ‒ number of neighbours in range  
`pᵢ` ‒ `i` neighbour's push

`P` ‒ push sum

<img src='./docs/formula_02.svg' alt='→P=∑(1<=i<=n)(→p_i)' />

### No peers in range

When there are no peers in range ant's velocity will be turned at random to left or right by angle between 0 and ant's _agility_.

<img src='./docs/diagram_03.svg' alt='diagram 3' />

`l` ‒ previous frame's velocity  
`α` ‒ amount to change velocity direction based on ants agility  
> `(Math.random() -.5) *2 *`_agility_

## Summary

It took about eight hours to work out the trigonometry and to implement it in TypeScript React.
I wrote automatic tests for the trigonometric functions because I figured these are fundamental and more difficult to debug later on.

It took about 16 hours more to implement control dock to change settings in real time, ants avoiding the cursor and to add a CSS styling and a few animations.
