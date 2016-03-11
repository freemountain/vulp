const regxp = /from \'\.\/(\.\.\/)*vulp\'/;
const subst = 'from \'vulp\'';

function replace(input) {
  return input.replace(regxp, subst);
}

replace.defaults = {
  accept: ['.js']
};

module.exports = replace;
