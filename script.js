const banner = document.getElementById('consent-banner');
const analyticsToggle = document.getElementById('analytics-toggle');
const marketingToggle = document.getElementById('marketing-toggle');
const acceptBtn = document.getElementById('accept-btn');
const rejectBtn = document.getElementById('reject-btn');
const saveBtn = document.getElementById('save-btn');
const preferencesBtn = document.getElementById('preferences-btn');
const preferencesPanel = document.getElementById('consent-preferences');
const navigationLinks = document.querySelectorAll('.topbar__tabs a[href^="#"]');

const CONSENT_KEY = 'nilrsf-consent';

function applyConsent(consent) {
  document.documentElement.dataset.consent = consent.analytics || consent.marketing ? 'accepted' : 'rejected';
  if (banner) {
    banner.classList.remove('is-visible');
  }
}

function loadConsent() {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    if (!stored) {
      if (banner) banner.classList.add('is-visible');
      return;
    }
    if (analyticsToggle) analyticsToggle.checked = Boolean(stored.analytics);
    if (marketingToggle) marketingToggle.checked = Boolean(stored.marketing);
    applyConsent(stored);
  } catch (error) {
    if (banner) banner.classList.add('is-visible');
  }
}

function persistConsent(analytics, marketing) {
  const consent = { analytics, marketing };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch (error) {
    // The choice remains active for this session when storage is unavailable.
  }
  applyConsent(consent);
}

if (banner) {
  acceptBtn?.addEventListener('click', () => persistConsent(true, true));
  rejectBtn?.addEventListener('click', () => persistConsent(false, false));
  preferencesBtn?.addEventListener('click', () => {
    const isExpanded = preferencesBtn.getAttribute('aria-expanded') === 'true';
    preferencesBtn.setAttribute('aria-expanded', String(!isExpanded));
    if (preferencesPanel) preferencesPanel.hidden = isExpanded;
  });
  saveBtn?.addEventListener('click', () => {
    persistConsent(Boolean(analyticsToggle?.checked), Boolean(marketingToggle?.checked));
  });
}

if ('IntersectionObserver' in window && navigationLinks.length) {
  const sections = [...navigationLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    const activeEntry = entries.find((entry) => entry.isIntersecting);
    if (!activeEntry) return;

    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${activeEntry.target.id}`;
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}

loadConsent();
