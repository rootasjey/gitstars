# Gitstars

A minimalist electron app to vizualize your GitHub starred repositories.

## Why ?

* Visualize your starred repos in a cards layout
* Fast UI
* Keep your starred repos open
* I wanted to learn about graph-ql client-side
* I wanted to play with Vue and Electron

## Screenshots

![home-light.png](./screenshots/home-light.png)
![home-dark.png](./screenshots/home-dark.png)
![repo-dark.png](./screenshots/repo-dark.png)

## Contributing

#### Build setup

``` bash
# install dependencies
npm install
# or
yarn

# serve with hot reload at localhost:9080
npm run dev
# or
yarn run dev

# build electron application for production
npm run build
# or
yarn run build

# run unit tests
npm test
# or
yarn run test


# lint all JS/Vue component files in `src/`
npm run lint
# or
yarn run lint
```

## About

This app uses:

* [electron-vue](https://github.com/SimulatedGREG/electron-vue)
* [GitHub graph-ql API](https://developer.github.com/v4/)
* [vue-apollo](https://github.com/akryum/vue-apollo)
* [vuetify](http://vuetifyjs.com)
