
    /**
     * Display current cookie preference status on the policy page
     */
    document.addEventListener('DOMContentLoaded', function() {
      const statusDisplay = document.getElementById('cookieStatusDisplay');
      if (!statusDisplay) return;

      const prefs = window.__cookiePrefs || {};
      const consentGiven = localStorage.getItem('armteqi-cookie-consent') ? true : false;

      if (!consentGiven) {
        statusDisplay.textContent = 'No consent given yet. Only essential cookies are active.';
        return;
      }

      const enabledCategories = [];
      for (const [key, value] of Object.entries(prefs)) {
        if (value === true) {
          const labels = {
            essential: 'Essential',
            analytics: 'Analytics',
            preferences: 'Preferences',
            marketing: 'Marketing'
          };
          enabledCategories.push(labels[key] || key);
        }
      }

      if (enabledCategories.length === 0) {
        statusDisplay.textContent = 'Only Essential cookies are enabled.';
      } else {
        statusDisplay.textContent = enabledCategories.join(', ') + ' cookies enabled.';
      }
    });
