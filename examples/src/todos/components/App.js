import t from 'tcomb';

import { element, decorators } from './../../fux';

import List from './List';
import Header from './Header';
import Footer from './Footer';
import StateView from './StateView';

const { component, checkContextType, styler, name } = decorators;

const contextType = t.struct({
  todos: t.list(t.struct({
    completed: t.Boolean,
    title:     t.String
  })),
  draft: t.String,
  filter:  t.String
});


function render({ context }) {
  const containerStyle = {
    display: 'flex'
  };

  const leftStyle = {
    flexBasis: '70%'
  };

  const rightStyle = {
    flexBasis: '30%'
  };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <Header />
        <List />
        <Footer />
      </div>
      <div style={rightStyle}>
        <StateView />
      </div>
    </div>
  );
}

export default component(
  checkContextType(contextType),
  styler(),
  name('App')
)(render);
