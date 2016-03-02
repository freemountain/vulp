import { h, helper, decorators } from './../../fux';

const { $rep } = helper;
const { component, memoize, controller } = decorators;

const createOption = (name, filter) => (
  <option value={ name } selected={ filter === name } >
    {name}
  </option>
);

function render({ context, dispatch }) {
  const filter = context.get('/filter');

  return (
    <div>
      <select onChange={dispatch('filterChange')}>
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
  controller({
    filterChange: ({ event }) => ['/filter', event.srcElement.value]
  })
)(render);
