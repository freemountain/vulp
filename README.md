<p align="center"><img width="100" src="manual/asset/fux.png"></p>

# fux
Fux is a user interface library with uni-directional dataflow.

## Install

### NPM
```shell
npm install --save-dev fux
```

### Starter Project
 - download example.zip from [Github](https://github.com/freemountain/fux/releases)
 - extract and run `npm run dev`
 - this starts a minimal build process with preconfigured babel and browserify
 - point your browser to [localhost:8080](http://localhost:8080/dist) to view the examples
 - or use this as template for your own project

## Usage
```javascript
import { element, cycle, views, scopes, decorators } from 'fux';

const { component, controller, dispatchChangeSets } = decorators;
const App = component(
  dispatchChangeSets(),
  controller({
    inc: ['/count', count => count + 1]
  }),
)(function({ context }) {
  return (
    <div>
      <input type='button' onClick='inc'/>
      {context.get('/count')}
    </div>
  );
});

const view = views.dom(document.body, App);
const scope = scopes.value({ count: 0 });

cycle(view, scope);
```

## Architecture
![overview](manual/asset/architecture.png)

- [Context](http://freemountain.github.io/fux/class/src/Context.js~Context.html)
  - immutable data structure (struct)
  - holds application context
  - emitted from scopes, when they have new data
  - consumed from views
- PatchSet
  - list of [json patch](http://jsonpatch.com/) objects
  - used like actions in flux architecture
  - used to manipulate Context
  - emitted from views, when they change state
  - consumed from scopes
- Scope
  - state container
  - representation of data that may change over time (stream)
- View
  - passes context to [deku component](http://dekujs.github.io/deku/)
  - render component to DOM
  - component may dispatch PatchSet on user interaction
  - available views
  - [fux.views.dom](http://freemountain.github.io/fux/function/index.html#static-function-combiner)

- [Component](http://freemountain.github.io/fux/typedef/index.html#static-typedef-Component)
  - stateless
  - dispatches side effects to scopes
  - additional functionality added through decorators

## Api
### fux
- [cycle](http://freemountain.github.io/fux/function/index.html#static-function-cycle)
- [element](http://freemountain.github.io/fux/typedef/index.html#static-typedef-element)

#### fux.scopes
- [combiner](http://freemountain.github.io/fux/function/index.html#static-function-combiner)
- [fragment](http://freemountain.github.io/fux/function/index.html#static-function-fragment)
- [value](http://freemountain.github.io/fux/function/index.html#static-function-value)

#### fux.views
- [dom](http://freemountain.github.io/fux/function/index.html#static-function-dom)

#### fux.decorators
- [checkContextType](http://freemountain.github.io/fux/function/index.html#static-function-checkContextType)
- [component](http://freemountain.github.io/fux/function/index.html#static-function-component)
- [controller](http://freemountain.github.io/fux/function/index.html#static-function-controller)
- [dispatchChangeSets](http://freemountain.github.io/fux/function/index.html#static-function-dispatchChangeSets)
- [log](http://freemountain.github.io/fux/function/index.html#static-function-log)
- [memoize](http://freemountain.github.io/fux/function/index.html#static-function-memoize)
- [mount](http://freemountain.github.io/fux/function/index.html#static-function-mount)
- [name](http://freemountain.github.io/fux/function/index.html#static-function-name)
- [styler](http://freemountain.github.io/fux/function/index.html#static-function-styler)

## Hack
```shell
git clone https://github.com/freemountain/fux
cd fux
npm install
npm run dev
```
... and click [here](http://localhost:4567/)

## License
The MIT License (MIT)
