import { h, views, scopes, decorators, helper } from './../fux';
import t from 'tcomb';
const { component, controller, name, styler , checkContextType } = decorators;
// const btnController = { inc: ['/count', v => v + 1] };
const btnController = { inc: ['/count', v => v + 1] };

const Label = component(
  //name('Label'),
  styler()

)(() => (<div style={{backgroundColor: 'green'}}>hi</div>));

const App = component(
  name('Example App'),
  checkContextType(t.struct({
    count: t.Number
  })),
  // controller(btnController)
)(function({ context, dispatch }) {
  return (<div>
    <Label />
    <input type='button' onClick={() => dispatch({ op: 'replace', path: '/count', value: context.get('/count') + 1 })}/>
    {context.get('/count')}
  </div>);
});

const view = views.dom(document.body, App);
const scope = scopes.value({ count: 0 });

export default () => helper.cycle(view, scope);
