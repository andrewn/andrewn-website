import * as d3 from 'd3-interpolate';

let styleElement = null;

/*
  Manage a dynamic stylesheet
*/
const createSheet = () => {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(''));
  document.head.appendChild(style);
  return style;
};

const deleteSheet = () => {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
};

const addCSSRule = (sheet, selector, rules, index) => {
  if ('insertRule' in sheet) {
    sheet.insertRule(selector + '{' + rules + '}', index);
  } else if ('addRule' in sheet) {
    sheet.addRule(selector, rules, index);
  }
};

const addRulesAtomic = ruleset => {
  deleteSheet(styleElement);
  styleElement = createSheet();

  const sheet = styleElement.sheet;

  ruleset.map(([selector, rules]) => addCSSRule(sheet, selector, rules));
};

/*
  Work out where we are in the day
*/
const startOfDaySeconds = () => {
  const d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d.getTime();
};

const numSecondsInDay = 24 * 60 * 60;

const pointWithinDay = () => {
  const numSecondsFromStartOfDay = (Date.now() - startOfDaySeconds()) / 1000;
  return numSecondsFromStartOfDay / numSecondsInDay;
};

/*
  Set colour scheme
*/
const cols = {
  start: ['#03154F', '#70e1f5', '#54F6EF', '#FF8500', '#03154F'],
  end: ['#072C7B', '#ffd194', '#FFF894', '#8E2B88', '#072C7B'],
};

const startInterpolator = d3.interpolateRgbBasis(cols.start);
const endInterpolator = d3.interpolateRgbBasis(cols.end);

const createGlobalThemeStyles = value => {
  const startCol = startInterpolator(value);
  const endCol = endInterpolator(value);

  const gradient = `
    background: -webkit-gradient(
      linear,
      left top,
      right bottom,
      from(${startCol}),
      to(${endCol})
    );
  `;

  const gradientOpacity = `
    background: -webkit-gradient(
      linear,
      left top,
      right bottom,
      from(${startCol.replace('rgb', 'rgba').replace(')', ', 0.4)')}),
      to(${endCol.replace('rgb', 'rgba').replace(')', ', 0.4)')})
    );
  `;

  const colour = `color: ${startCol}`;

  const textGradient = `
  background: -webkit-gradient(linear,left top,right bottom,from(${startCol}),to(${endCol}));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `;

  const borderBottomGradient = `
      border-bottom: 1px solid #333;
      border-width: 0 0 1px 0;
      border-image: -webkit-gradient(linear, left top, right bottom, from(${startCol}), to(${endCol})) 1;
    `;

  const borderBottom = `border-bottom: 1px solid ${startCol};`;

  addRulesAtomic([
    ['.themeGradient', gradient],
    ['.themeGradientOpacity', gradientOpacity],
    ['.themeTextGradient', textGradient],
    ['.themeBorderBottomGradient', borderBottomGradient],
    ['.themeBorderBottom', borderBottom],
    ['a:hover:not(.noThemeHoverBorder)', borderBottom],
    ['a:hover:not(.noThemeHoverColor)', colour],
  ]);
};

const updateTheme = () => {
  createGlobalThemeStyles(pointWithinDay());
};

updateTheme();

setInterval(updateTheme, 1000 * 60);
