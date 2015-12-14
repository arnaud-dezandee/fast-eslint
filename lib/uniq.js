'use babel';

/**
 * Interface
 */

export default function uniq(array) {
  const temp = {};
  let res = [];

  array.forEach(value => {
    if (temp.hasOwnProperty(value)) {
      return;
    }
    res = [...res, value];
    temp[value] = 1;
  });

  return res;
}
