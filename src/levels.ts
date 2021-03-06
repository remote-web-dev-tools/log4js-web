import { LayoutFontColor } from './layouts';

type LevelType = 'ALL' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' | 'MARK' | 'OFF';

class Level {
  static levels: Level[] = [];

  constructor(public level: number, public levelStr: string, public colour: LayoutFontColor) {
    this.level = level;
    this.levelStr = levelStr;
    this.colour = colour;
  }

  static getLevel(level: LevelType | Level, defaultLevel?: Level): Level {
    if (level instanceof Level) {
      return level;
    }

    const levelInstance = BUILD_IN_LEVEL[level] || defaultLevel;

    if (!levelInstance) {
      throw new Error(`${level} isn't one of ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, MARK, OFF`);
    }

    return levelInstance;
  }

  toString() {
    return this.levelStr;
  }

  isLessThanOrEqualTo(otherLevel: Level) {
    return this.level <= otherLevel.level;
  }

  isGreaterThanOrEqualTo(otherLevel: Level) {
    return this.level >= otherLevel.level;
  }

  isEqualTo(otherLevel: Level) {
    return this.level === otherLevel.level;
  }
}

// Init builtin Level
const BUILD_IN_LEVEL: Record<LevelType, Level> = {
  ALL: new Level(Number.MIN_VALUE, 'ALL', 'grey'),
  TRACE: new Level(5000, 'TRACE', 'blue'),
  DEBUG: new Level(10000, 'DEBUG', 'cyan'),
  INFO: new Level(20000, 'INFO', 'green'),
  WARN: new Level(30000, 'WARN', 'yellow'),
  ERROR: new Level(40000, 'ERROR', 'red'),
  FATAL: new Level(50000, 'FATAL', 'magenta'),
  MARK: new Level(9007199254740992, 'MARK', 'grey'),
  OFF: new Level(Number.MAX_VALUE, 'OFF', 'grey'),
};

export { Level, BUILD_IN_LEVEL as Levels, LevelType };
