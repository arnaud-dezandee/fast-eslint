'use babel';

/**
 * Interface
 */

export default function uniq(array) {
  const temp = {};
  const res = [];

  array.forEach(value => {
    if (temp.hasOwnProperty(value)) {
      return;
    }
    res.push(value);
    temp[value] = 1;
  });

  return res;
}
