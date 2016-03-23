import t from 'tcomb';

import { element, decorators } from './../../vulp';

import Todo from './Todo';
import Header from './Header';
import StateView from './../../StateView';

const { component, contextType, styler, name, listOf, lens } = decorators;

const ContextType = t.struct({
  todos: t.list(t.struct({
    completed: t.Boolean,
    title:     t.String
  })),
  draft:  t.String,
  filter: t.String
});

const filter = {
  all:       () => true,
  completed: todo => todo.completed,
  active:    todo => !todo.completed
};

const List = listOf()(Todo);
const MountedList = lens('/todos')(List);

export default component(
  contextType(ContextType),
  styler(),
  name('App')
)(function render({ context }) {
  const currentFilter = filter[ context.get('/filter') ];

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flexBasis: '70%' }}>
        <Header />
        <MountedList filter={currentFilter}/>
        <div><a href='#all'>all</a></div>
        <div><a href='#active'>active</a></div>
        <div><a href='#completed'>completed</a></div>
      </div>
      <div style={{ flexBasis: '30%' }}>
        <StateView />
      </div>
    </div>
  );
});
