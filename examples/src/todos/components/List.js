import { h, decorators } from './../../fux';

import _Todo from './Todo';

const { memoize, component, name } = decorators;

const filters = {
  all:       () => true,
  completed: todo => todo.completed,
  active:    todo => !todo.completed
};

function render({ context }) {
  let filter = filters[ context.get('/filter') ];

  if(!filter) filter = filters.all;

  const todos = context.get('/todos', true).slice();

  const children = todos
    .map((_, i) => i)
    .filter(i => filter(todos[ i ]))
    .map(function(index) {
      const Todo = decorators.mount({
        title:     `/todos/${index}/title`,
        completed: `/todos/${index}/completed`
      })(_Todo);

      return (<li><Todo key={index}/></li>);
    });

  return (
    <ul>
      {children}
    </ul>
  );
}

export default component(
  memoize(),
  name('List')
)(render);
