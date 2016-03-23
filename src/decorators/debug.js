import { specDecorator } from './utils';

const warn = msg => console.warn ? console.warn(msg) : console.log(`Waring:\n${msg}`);
const dir = obj => console.dir ? console.dir(obj) : console.log(obj);
const createHandler = name => function(component, model) {
  const handler = component[ name ] ? component[ name ] : () => null;

  try {
    return handler(model);
  } catch(e) {
    warn(`Error in ${component.name}#${name}`);
    console.log('Component:');
    dir(component);
    throw e;
  }
};

const spec = {
  deep:     true,
  cache:    new WeakMap(),
  name:     'debug',
  render:   createHandler('render'),
  onCreate: createHandler('onCreate'),
  onUpdate: createHandler('onUpdate'),
  onRemove: createHandler('onRemove')
};

export default () => specDecorator(spec, false);
