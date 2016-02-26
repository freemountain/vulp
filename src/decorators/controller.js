import JSONPointer from './../JSONPointer';
import normalize from './../utils/normalizeComponent';

const controllerDecorator = controller => rawComponent => {
  const component = normalize(rawComponent);

  function render(model) {
    const dispatch = function(name) {
      if(!controller[ name ]) return () => null;
      return function(e) {
        const decoratedDispatch = function(patchSet = []) {
          model.dispatch(patchSet.map(function(patch) {
            if(!patch.path) return patch;
            const newPatch = Object.assign({}, patch);
            const pointer = JSONPointer.ofString(patch.path);

            newPatch.path = model.context.transform.apply(pointer).toRFC();
            return newPatch;
          }));
        };

        const patchSet = controller[ name ](e, model, decoratedDispatch);

        decoratedDispatch(patchSet);
      };
    };

    const decoratedModel = Object.assign({}, model, { dispatch });

    return component.render(decoratedModel);
  }

  return Object.assign({}, component, { render });
};

export default controllerDecorator;
