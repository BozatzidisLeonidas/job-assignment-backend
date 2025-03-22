import ParseDashboard from 'parse-dashboard';
import { dashboardConfig } from '../config/config.js';

export const setupDashboard = () => {
  return new ParseDashboard(dashboardConfig, { allowInsecureHTTP: true });
};