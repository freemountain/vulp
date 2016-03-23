import { element, decorators } from './vulp';

const { component, memoize, styler } = decorators;

function render({ context }) {
  const text = JSON.stringify(context.get('', true), null, '  ');

  return (
    <div>
      <textarea rows='20' cols='50'>
        {text}
      </textarea>
    </div>
  );
}

export default component(
  memoize(),
  styler()
)(render);
