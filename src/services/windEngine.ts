export {
  COMPASS_POINTS,
  COMPASS_DEGREES,
  normalizeAngle,
  calculateRunwayOrientation,
  calculateWindComponents,
  isSectorFavorable,
  calculateOACIUsability,
  getDefaultArgentineWindDistribution
} from '../calculations/windCalculations';

export type { WindComponentResult, OACIUsabilityResult } from '../calculations/windCalculations';
