/**
 * COOKIE CONSENT SYSTEM · Armteqi
 * Modern, accessible, and privacy-first cookie management
 *
 * Features:
 * - Versioned storage with automatic migration
 * - Keyboard focus trapping inside modal (Tab / Shift+Tab)
 * - ARIA attributes for accessibility
 * - Scroll locking with body class
 * - Event-driven architecture for third-party integrations
 * - Theme preference integration
 *
 * @version 2.1.0
 * @author Armteqi Team
 */

(function () {
  'use strict';

  // ─── CONSTANTS ───────────────────────────────────────────────

  const STORAGE_KEY = 'armteqi-cookie-consent';
  const STORAGE_VERSION = 2;
  const BODY_MODAL_OPEN_CLASS = 'modal-open';

  // Toggle for development logging
  const DEBUG = false;

  const CATEGORIES = {
    essential: {
      label: 'Essential',
      description: 'Required for basic functionality and security. Always enabled.',
      required: true,
      default: true
    },
    analytics: {
      label: 'Analytics',
      description: 'Help us understand how you use Armteqi, anonymously.',
      required: false,
      default: false,
      // scriptHandler: 'loadAnalytics' // Uncomment and implement when ready
    },
    preferences: {
      label: 'Preferences',
      description: 'Remember your settings, such as theme preference.',
      required: false,
      default: false,
      // scriptHandler: 'loadPreferences'
    },
    marketing: {
      label: 'Marketing',
      description: 'We do not use marketing cookies at this time.',
      required: false,
      default: false,
      // scriptHandler: 'loadMarketing'
    }
  };

  const CATEGORY_ICONS = {
    essential: 'fa-shield-halved',
    analytics: 'fa-chart-simple',
    preferences: 'fa-sliders',
    marketing: 'fa-bullhorn'
  };

  // ─── STATE ───────────────────────────────────────────────────

  let preferences = {};
  let consentGiven = false;
  let isPanelOpen = false;

  // ─── DOM REFS ────────────────────────────────────────────────

  let banner, overlay, panel;
  let acceptBtn, customizeBtn;
  let panelClose, panelSave, panelAcceptAll, panelRejectOptional;
  let prefsList;

  let lastFocusedElement = null;
  let focusableElements = [];

  function cacheDomElements() {
    banner = document.getElementById('cookieBanner');
    overlay = document.getElementById('cookieOverlay');
    panel = document.getElementById('cookiePanel');
    acceptBtn = document.getElementById('cookieAcceptBtn');
    customizeBtn = document.getElementById('cookieCustomizeBtn');
    panelClose = document.getElementById('panelCloseBtn');
    panelSave = document.getElementById('panelSaveBtn');
    panelAcceptAll = document.getElementById('panelAcceptAllBtn');
    panelRejectOptional = document.getElementById('panelRejectOptionalBtn');
    prefsList = document.getElementById('prefsList');
  }

  // ─── STORAGE HELPERS ────────────────────────────────────────

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;

      if (!data.version || data.version < STORAGE_VERSION) {
        return migrateStorage(data);
      }

      if (data.version === STORAGE_VERSION) {
        return {
          preferences: data.preferences || {},
          consentGiven: data.consentGiven === true,
          timestamp: data.timestamp || null
        };
      }

      return null;
    } catch (_) {
      return null;
    }
  }

  function migrateStorage(oldData) {
    let migratedPrefs = {};

    if (oldData && typeof oldData === 'object' && !oldData.version) {
      const hasCategory = Object.keys(CATEGORIES).some(key => key in oldData);

      if (hasCategory) {
        for (const key of Object.keys(CATEGORIES)) {
          migratedPrefs[key] = oldData[key] === true;
        }
        migratedPrefs.essential = true;

        const consent = oldData.consentGiven === true;

        const newData = {
          version: STORAGE_VERSION,
          timestamp: oldData.timestamp || new Date().toISOString(),
          consentGiven: consent,
          preferences: migratedPrefs
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (_) {}

        return {
          preferences: migratedPrefs,
          consentGiven: consent,
          timestamp: newData.timestamp
        };
      }
    }

    return null;
  }

  function saveToStorage(prefs, given = true) {
    prefs.essential = true;
    const data = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      consentGiven: given,
      preferences: { ...prefs }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function getDefaultPreferences() {
    const prefs = {};
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      prefs[key] = cat.default || false;
    }
    prefs.essential = true;
    return prefs;
  }

  // ─── PREFERENCES MANAGEMENT ─────────────────────────────────

  function loadPreferences() {
    const stored = loadFromStorage();

    if (stored && stored.preferences && typeof stored.preferences === 'object') {
      const prefs = { ...stored.preferences };
      prefs.essential = true;

      for (const key of Object.keys(CATEGORIES)) {
        if (!(key in prefs)) {
          prefs[key] = CATEGORIES[key].default || false;
        }
      }

      return {
        preferences: prefs,
        consentGiven: stored.consentGiven === true
      };
    }

    const defaults = getDefaultPreferences();
    return {
      preferences: defaults,
      consentGiven: false
    };
  }

  function applyPreferences(prefs) {
    prefs.essential = true;
    preferences = { ...prefs };

    const event = new CustomEvent('cookieConsentUpdated', {
      detail: {
        preferences: prefs,
        consentGiven: consentGiven,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(event);

    window.__cookiePrefs = prefs;

    handleThemePreference(prefs);

    if (DEBUG) {
      console.log('🍪 Cookie preferences applied:', prefs);
    }
  }

  function handleThemePreference(prefs) {
    if (prefs.preferences === true) {
      document.dispatchEvent(new CustomEvent('themePreferenceEnabled', {
        detail: { enabled: true }
      }));
    } else {
      document.dispatchEvent(new CustomEvent('themePreferenceEnabled', {
        detail: { enabled: false }
      }));
    }
  }

  // ─── UI RENDER ──────────────────────────────────────────────

  function renderPanel(prefs) {
    if (!prefsList) return;

    let html = '';
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      const isRequired = cat.required === true;
      const isChecked = prefs[key] === true;
      const icon = CATEGORY_ICONS[key] || 'fa-circle';

      html += `
        <div class="pref-item" data-category="${key}">
          <div class="info">
            <span class="label">
              <i class="fas ${icon}" style="color:var(--cookie-accent-soft);margin-right:8px;width:18px;"></i>
              ${cat.label}
            </span>
            <span class="desc">${cat.description}</span>
          </div>
          ${isRequired ? '<span class="required-badge">Required</span>' : ''}
          <label class="toggle-wrap">
            <input type="checkbox"
                   data-category="${key}"
                   ${isRequired ? 'disabled checked' : ''}
                   ${!isRequired && isChecked ? 'checked' : ''}
                   aria-label="Toggle ${cat.label} cookies">
            <span class="toggle-track"></span>
          </label>
        </div>
      `;
    }
    prefsList.innerHTML = html;
  }

  function getPreferencesFromPanel() {
    const toggles = prefsList.querySelectorAll('input[type="checkbox"]');
    const prefs = {};
    toggles.forEach((toggle) => {
      const cat = toggle.dataset.category;
      prefs[cat] = toggle.checked;
    });
    prefs.essential = true;
    return prefs;
  }

  // ─── BANNER / PANEL VISIBILITY ─────────────────────────────

  function showBanner() {
    if (banner) {
      banner.classList.add('active');
      banner.setAttribute('aria-hidden', 'false');
    }
  }

  function hideBanner() {
    if (banner) {
      banner.classList.remove('active');
      banner.setAttribute('aria-hidden', 'true');
    }
  }

  function showPanel() {
    if (!panel) return;

    lastFocusedElement = document.activeElement;

    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');

    if (overlay) {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
    }

    isPanelOpen = true;
    document.body.classList.add(BODY_MODAL_OPEN_CLASS);

    updateFocusableElements();
    focusFirstElement();

    // Trap Tab key inside the panel (correct approach)
    panel.addEventListener('keydown', trapTabKey);
  }

  function hidePanel() {
    if (!panel) return;

    panel.classList.remove('active');
    panel.setAttribute('aria-hidden', 'true');

    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    isPanelOpen = false;
    document.body.classList.remove(BODY_MODAL_OPEN_CLASS);

    // Remove focus trap listener
    panel.removeEventListener('keydown', trapTabKey);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      setTimeout(() => {
        lastFocusedElement.focus();
      }, 50);
    }
    lastFocusedElement = null;
  }

  // ─── FOCUS MANAGEMENT ───────────────────────────────────────

  function updateFocusableElements() {
    if (!panel) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    focusableElements = Array.from(
      panel.querySelectorAll(focusableSelector)
    ).filter((el) => !el.disabled && el.offsetParent !== null);
  }

  function focusFirstElement() {
    if (focusableElements.length > 0) {
      const closeBtn = panel.querySelector('.close-btn');
      if (closeBtn && focusableElements.includes(closeBtn)) {
        closeBtn.focus();
      } else {
        focusableElements[0].focus();
      }
    }
  }

  /**
   * Proper focus trapping for Tab / Shift+Tab
   */
  function trapTabKey(e) {
    if (!isPanelOpen || !panel) return;
    if (e.key !== 'Tab') return;

    const currentIndex = focusableElements.indexOf(document.activeElement);

    if (e.shiftKey) {
      // Shift+Tab on first element → go to last
      if (currentIndex <= 0) {
        e.preventDefault();
        focusableElements[focusableElements.length - 1]?.focus();
      }
    } else {
      // Tab on last element → go to first
      if (currentIndex >= focusableElements.length - 1) {
        e.preventDefault();
        focusableElements[0]?.focus();
      }
    }
  }

  // ─── ARIA HELPERS ───────────────────────────────────────────

  function updateAriaAttributes() {
    if (panel) {
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-hidden', isPanelOpen ? 'false' : 'true');
    }

    if (overlay) {
      overlay.setAttribute('aria-hidden', isPanelOpen ? 'false' : 'true');
    }
  }

  // ─── EVENT HANDLERS ─────────────────────────────────────────

  function handleAcceptAll() {
    const prefs = {};
    for (const key of Object.keys(CATEGORIES)) {
      prefs[key] = true;
    }
    prefs.essential = true;
    consentGiven = true;
    saveToStorage(prefs, true);
    applyPreferences(prefs);
    hideBanner();
    hidePanel();
  }

  function handleRejectOptional() {
    const prefs = {};
    for (const key of Object.keys(CATEGORIES)) {
      prefs[key] = CATEGORIES[key].required === true;
    }
    consentGiven = true;
    saveToStorage(prefs, true);
    applyPreferences(prefs);
    hideBanner();
    hidePanel();
  }

  function handleCustomize() {
    renderPanel(preferences);
    showPanel();
  }

  function handlePanelSave() {
    const prefs = getPreferencesFromPanel();
    consentGiven = true;
    saveToStorage(prefs, true);
    applyPreferences(prefs);
    hidePanel();
    hideBanner();
  }

  function handlePanelAcceptAll() {
    const prefs = {};
    for (const key of Object.keys(CATEGORIES)) {
      prefs[key] = true;
    }
    prefs.essential = true;
    consentGiven = true;
    renderPanel(prefs);
    saveToStorage(prefs, true);
    applyPreferences(prefs);
    hidePanel();
    hideBanner();
  }

  function handlePanelRejectOptional() {
    const prefs = {};
    for (const key of Object.keys(CATEGORIES)) {
      prefs[key] = CATEGORIES[key].required === true;
    }
    consentGiven = true;
    renderPanel(prefs);
    saveToStorage(prefs, true);
    applyPreferences(prefs);
    hidePanel();
    hideBanner();
  }

  function handleOverlayClick(e) {
    if (e.target === overlay) {
      hidePanel();
    }
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape' && isPanelOpen) {
      hidePanel();
    }
  }

  // ─── INITIALIZATION ─────────────────────────────────────────

  function init() {
    cacheDomElements();

    if (!banner || !panel || !prefsList) {
      if (DEBUG) console.warn('🍪 Cookie consent: missing required DOM elements.');
      return;
    }

    const result = loadPreferences();
    preferences = result.preferences;
    consentGiven = result.consentGiven;

    applyPreferences(preferences);

    if (consentGiven) {
      hideBanner();
      hidePanel();
    } else {
      showBanner();
      hidePanel();
      renderPanel(preferences);
    }

    updateAriaAttributes();

    // ─── EVENT LISTENERS ──────────────────────────────────────

    if (acceptBtn) acceptBtn.addEventListener('click', handleAcceptAll);
    if (customizeBtn) customizeBtn.addEventListener('click', handleCustomize);

    if (panelClose) panelClose.addEventListener('click', hidePanel);
    if (panelSave) panelSave.addEventListener('click', handlePanelSave);
    if (panelAcceptAll) panelAcceptAll.addEventListener('click', handlePanelAcceptAll);
    if (panelRejectOptional) panelRejectOptional.addEventListener('click', handlePanelRejectOptional);

    if (overlay) overlay.addEventListener('click', handleOverlayClick);

    // All "Manage Cookies" links – just rely on the class, no clone tricks
    document.querySelectorAll('.cookie-manage-link').forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        handleCustomize();
      });
    });

    document.addEventListener('keydown', handleEscapeKey);

    if (DEBUG) {
      console.log('🍪 Cookie consent system initialized.');
      console.log('   Consent given:', consentGiven);
      console.log('   Preferences:', preferences);
    }
  }

  // ─── START ──────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();