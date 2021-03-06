import { isBuildInAppender } from './appenders';
import { CategoryConfigure } from './categories';
import { setupCategories } from './categories';
import { inspect } from 'util';

const not = (thing: unknown) => !thing;

const anObject = (thing: unknown) => thing && typeof thing === 'object' && !Array.isArray(thing);

const anArray = (thing: unknown): boolean => thing && Array.isArray(thing);

const anFunction = (thing: unknown): boolean => thing && typeof thing === 'function';

const throwExceptionIf = (config: unknown, checks: boolean | boolean[], message: string): void => {
  const tests = Array.isArray(checks) ? checks : [checks];
  tests.forEach((test) => {
    if (test) {
      throw new Error(
        `Problem with log4js configuration: (${inspect(config, {
          depth: 5,
        })})` + ` - ${message}`
      );
    }
  });
};

/**
 * log4js-web configuration
 */
export interface Configuration {
  categories?: Record<string, CategoryConfigure>;
}

export const configure = (configuration: Configuration): void => {
  /**
   * check configuration is an object
   */
  throwExceptionIf(configuration, not(anObject(configuration)), 'must be an object.');

  /**
   * check categories is an object
   */
  throwExceptionIf(configuration, not(anObject(configuration.categories)), 'categories must be an object.');

  /**
   * check must define at least on categories
   */
  const categoryNames = Object.keys(configuration.categories);
  throwExceptionIf(configuration, not(categoryNames.length), 'must define at least one category.');

  categoryNames.forEach((category) => {
    const categoryConfigure = configuration.categories[category];

    /**
     * check category must define at least one appender
     */
    throwExceptionIf(
      configuration,
      not(anArray(categoryConfigure.appenders)),
      `category ${inspect(categoryConfigure)} is not valid (must be an object with property "appenders").`
    );

    throwExceptionIf(
      configuration,
      not(categoryConfigure.appenders.length),
      `category ${inspect(categoryConfigure)} is not valid (must define at least one appender).`
    );

    categoryConfigure.appenders.forEach((appender) => {
      /**
       * check category must define type property
       */
      throwExceptionIf(
        configuration,
        not(appender.type),
        `appender ${inspect(appender)} is not valid (must be an object with property "type").`
      );

      if (!isBuildInAppender(appender.type)) {
        /**
         * check custom category must define type configure
         */
        throwExceptionIf(
          configuration,
          not(anFunction(appender.configure)),
          `appender "${inspect(appender)}" is not valid (must be an object with function property "configure").`
        );
      }
    });
  });

  setupCategories(configuration);
};
