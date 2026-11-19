import {
  INITIAL_TRACKER_DATA,
  INITIAL_SIMS_STATE,
  INITIAL_USER_STATS
} from '../data/initialData';

const BASE_KEYS = {
  TRACKER: 'pennywise_tracker_v1',
  SIMS: 'pennywise_sims_v1',
  USER_STATS: 'pennywise_stats_v1',
  LAST_TAB: 'pennywise_active_tab_v1'
};

function getKey(baseKey, userId) {
  if (!userId) return baseKey;
  return `${baseKey}_${userId}`;
}

export function loadTrackerData(userId = null) {
  try {
    const key = getKey(BASE_KEYS.TRACKER, userId);
    const raw = localStorage.getItem(key);
    if (!raw) return INITIAL_TRACKER_DATA;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tracker data', e);
    return INITIAL_TRACKER_DATA;
  }
}

export function saveTrackerData(data, userId = null) {
  try {
    const key = getKey(BASE_KEYS.TRACKER, userId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save tracker data', e);
  }
}

export function loadSimsData(userId = null) {
  try {
    const key = getKey(BASE_KEYS.SIMS, userId);
    const raw = localStorage.getItem(key);
    if (!raw) return INITIAL_SIMS_STATE;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load sims data', e);
    return INITIAL_SIMS_STATE;
  }
}

export function saveSimsData(data, userId = null) {
  try {
    const key = getKey(BASE_KEYS.SIMS, userId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save sims data', e);
  }
}

export function loadUserStats(userId = null) {
  try {
    const key = getKey(BASE_KEYS.USER_STATS, userId);
    const raw = localStorage.getItem(key);
    if (!raw) return INITIAL_USER_STATS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user stats', e);
    return INITIAL_USER_STATS;
  }
}

export function saveUserStats(data, userId = null) {
  try {
    const key = getKey(BASE_KEYS.USER_STATS, userId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

export function loadActiveTab() {
  return localStorage.getItem(BASE_KEYS.LAST_TAB) || 'tracker';
}

export function saveActiveTab(tab) {
  localStorage.setItem(BASE_KEYS.LAST_TAB, tab);
}

export function resetAllDataToDemo(userId = null) {
  const trackerKey = getKey(BASE_KEYS.TRACKER, userId);
  const simsKey = getKey(BASE_KEYS.SIMS, userId);
  const statsKey = getKey(BASE_KEYS.USER_STATS, userId);

  localStorage.removeItem(trackerKey);
  localStorage.removeItem(simsKey);
  localStorage.removeItem(statsKey);
  localStorage.removeItem(BASE_KEYS.LAST_TAB);
}
