interface ConsoleColoring {
  text?: string;
  bg?: string;
}
const _colors = {
  default: { text: '#CCC', bg: '#000' },
  guard: { text: '#0F0', bg: '#333' },
  redir: { text: '#FF0', bg: '#F00' },
  auth: { text: '#6FF', bg: '#300' }
};

class CustomLogger {
  private __log({
    args,
    coloring
  }: {
    args: any[];
    coloring?: ConsoleColoring;
  }) {
    const bgColor = (coloring && coloring.bg) || _colors.default.bg;
    const textColor = (coloring && coloring.text) || _colors.default.text;
    const colorstr = `background:${bgColor};color:${textColor};border-left:5px solid ${textColor};padding-left:5px;`;
    const first = args.shift();
    if (typeof first === 'string') {
      console.warn('%c' + first, colorstr, ...args);
    } else {
      console.warn('%clogger:', colorstr, first, ...args);
    }
  }
  public default(...args: any[]) {
    this.__log({ args });
  }

  public guard(...args: any[]) {
    this.__log({ args, coloring: _colors.guard });
  }

  public auth(...args: any[]) {
    this.__log({ args, coloring: _colors.auth });
  }

  public redir(...args: any[]) {
    this.__log({ args, coloring: _colors.redir });
  }
}

const logger: CustomLogger = new CustomLogger();
export { logger };
