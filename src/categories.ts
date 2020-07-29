import { AppenderConfig, getAppender } from './appenders';
import { Appender } from './appenders/appender';
import { Configuration } from './configure/configure';

interface CategoryConfigure {
  appenders: AppenderConfig[];
}

class Category {
  public name: string;
  public appenders: Appender[] = [];

  constructor(name: string, configure: CategoryConfigure) {
    this.name = name;

    this.appenders = configure.appenders.map((appenderConfig) => {
      return getAppender(appenderConfig);
    });
  }
}

const categories: Map<string, Category> = new Map<string, Category>();

/**
 * setup categories
 * @param config
 */
const setupCategories = (config: Configuration): void => {
  categories.clear();

  const categoryNames = Object.keys(config.categories);
  categoryNames.forEach((name) => {
    const category = config.categories[name];
    categories.set(name, new Category(name, category));
  });
};

/**
 * get category by category name
 * if category not defined, will return default category
 * @param category
 */
const getCategoryByCategoryName = (category?: string): Category => {
  if (categories.has(category)) {
    return categories.get(category);
  }

  return categories.get('default');
};

/**
 * Set default category
 */
categories.set(
  'default',
  new Category('default', {
    appenders: [{ type: 'console' }],
  })
);

export { Category, CategoryConfigure, setupCategories, getCategoryByCategoryName };
