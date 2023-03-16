import test from 'ava';

import { CORRECT } from './correctResult';
import { getCategoryTree } from './task';

test('getCategoryTree should return new ordered category tree', async (t) => {
  const categoryTree = await getCategoryTree();

  t.deepEqual(categoryTree, CORRECT);
});
