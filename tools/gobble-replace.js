const regxp = /from \'\.\/(\.\.\/)*fux\'/;
const subst = 'from \'fux\'';

function replace(input) {
  return input.replace(regxp, subst);
}

replace.defaults = {
  accept: ['.js']
};

module.exports = replace;
