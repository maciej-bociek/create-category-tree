import { Category, getCategories } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export const getCategoryTree = async (): Promise<CategoryListElement[]> => {
  const categories = await getCategories();

  if (!categories.data) {
    return [];
  }

  const categoryTree = categories.data.map((category) =>
    processCategory(category)
  );

  categoryTree.sort(sortCategoriesByOrder);

  return setCategoriesToShowOnHome(categoryTree);
};

function processCategory(category: Category): CategoryListElement {
  const children = category.children?.map((child) => processCategory(child));
  const sortedChildren = children?.sort(sortCategoriesByOrder);

  return {
    id: category.id,
    image: category.MetaTagDescription,
    name: category.name,
    order: getOrderNumber(category),
    children: sortedChildren,
    showOnHome: false,
  };
}

function sortCategoriesByOrder(
  categoryA: CategoryListElement,
  categoryB: CategoryListElement
): number {
  return categoryA.order - categoryB.order;
}

function getOrderNumber(category: Category): number {
  const order = getCategoryOrderFromTitle(category);
  return isNaN(order) ? category.id : order;
}

function getCategoryOrderFromTitle(category: Category): number {
  const title = category.Title || '';
  const orderSeparatorIndex = title.indexOf('#');
  const orderString =
    orderSeparatorIndex >= 0 ? title.substring(0, orderSeparatorIndex) : title;
  return parseInt(orderString);
}

function setCategoriesToShowOnHome(
  categoryTree: CategoryListElement[]
): CategoryListElement[] {
  if (categoryTree.length <= 5) {
    return categoryTree.map((category) => ({
      ...category,
      showOnHome: true,
    }));
  } else {
    const toShowOnHome = categoryTree
      .filter((c) => c.order < 3)
      .map((c) => c.id);
    return categoryTree.map((category) => ({
      ...category,
      showOnHome: toShowOnHome.includes(category.id),
    }));
  }
}
