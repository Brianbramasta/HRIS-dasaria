// SVGR mock to support `import { ReactComponent } from '...svg'`
module.exports = {
  __esModule: true,
  default: 'svg-url-stub',
  ReactComponent: () => 'svg',
};