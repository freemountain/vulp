import { element, decorators } from './../../vulp';

const { component, memoize, controller, dispatchChangeSets, name } = decorators;

const createOption = (name, filter) => (
  <option value={ name } selected={ filter === name } >
    {name}
  </option>
);

function render({ context }) {
  const filter = context.get('/filter');

  return (
    <div>
      <select onChange='filterChange'>
        {[
          createOption('all', filter),
          createOption('active', filter),
          createOption('completed', filter)
        ]}
      </select>
      <div>
        <div><a href='#all'>all</a></div>
        <div><a href='#active'>active</a></div>
        <div><a href='#completed'>completed</a></div>
      </div>
    </div>
  );
}

export default component(
  memoize(),
  dispatchChangeSets(),
  controller({
    filterChange: ({ event }) => ['/filter', event.srcElement.value]
  }),
  name('Footer')
)(render);
