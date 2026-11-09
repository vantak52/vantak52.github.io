(() => {
  'use strict';
  const data = window.PORTFOLIO;
  if (!data) return;
  let language = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const t = key => data.copy[language][key] ?? data.copy.ru[key] ?? key;
  const persist = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const localProject = project => {
    const local = language === 'en' ? project.en || {} : {};
    return {...project, ...local,
      desktop: project.desktop ? {...project.desktop, ...local.desktop} : null,
      mobile: project.mobile ? {...project.mobile, ...local.mobile} : null};
  };
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = (value, image = false) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, document.baseURI);
      return (image ? ['http:', 'https:', 'file:'] : ['http:', 'https:']).includes(url.protocol) ? value : '';
    } catch { return ''; }
  };
  const imageInfo = (value) => value && safeUrl(value.src, true) ? value : null;
  const embeddedUrl = (value) => {
    const safe = safeUrl(value);
    if (!safe) return '';
    const url = new URL(safe, document.baseURI);
    return url.origin === location.origin ? url.href : '';
  };
  const makeImage = (image, eager = false) => `<img src="${esc(safeUrl(image.src, true))}" alt="${esc(image.alt)}"${Number(image.width) > 0 ? ` width="${Number(image.width)}"` : ''}${Number(image.height) > 0 ? ` height="${Number(image.height)}"` : ''} loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;

  document.querySelectorAll('[data-brand]').forEach(el => {
    if (data.logo && safeUrl(data.logo.src, true)) {
      el.innerHTML = `<img src="${esc(data.logo.src)}" alt="${esc(data.brand)}"${data.logo.width ? ` width="${Number(data.logo.width)}"` : ''}${data.logo.height ? ` height="${Number(data.logo.height)}"` : ''}>`;
    } else el.innerHTML = `${esc(data.brand)}<span class="brand-dot" aria-hidden="true">.</span>`;
  });
  document.querySelectorAll('[data-telegram]').forEach(el => { if (safeUrl(data.telegram.url)) el.href = data.telegram.url; });
  if (data.ownerName) document.querySelectorAll('[data-owner-name]').forEach(el => { el.textContent = data.ownerName; });
  document.querySelectorAll('[data-telegram-handle]').forEach(el => { el.textContent = data.telegram.handle; });
  document.querySelectorAll('[data-email]').forEach(el => {
    el.href = `mailto:${data.email}`;
    el.innerHTML = `${esc(data.email)}${icon('arrow-up-right')}`;
  });
  document.querySelector('#year').textContent = new Date().getFullYear();

  function placeholder(project, mobile = false) {
    return `<div class="screen-placeholder ${mobile ? 'mobile' : 'desktop'}-placeholder"><span class="placeholder-number" aria-hidden="true">${esc(project.number)}</span><span class="placeholder-name">${esc(project.title)}</span><span class="placeholder-caption">${esc(t(mobile ? 'mobilePlaceholder' : 'desktopPlaceholder'))}</span><span class="placeholder-device">${esc(t(mobile ? 'phone' : 'desktop'))}</span></div>`;
  }
  function screenshot(project, mobile = false) {
    const image = imageInfo(mobile ? project.mobile : project.desktop);
    if (!image) return placeholder(project, mobile);
    const label = `${project.title} — ${t(mobile ? 'mobile' : 'desktop')}`;
    const embedded = embeddedUrl(project.embedUrl);
    const action = embedded
      ? `data-project-url="${esc(embedded)}" data-project-title="${esc(project.title)}" data-project-device="${mobile ? 'mobile' : 'desktop'}"`
      : `data-full-image="${esc(safeUrl(image.full, true) || image.src)}" data-image-alt="${esc(image.alt || label)}" data-image-title="${esc(label)}"`;
    return `<button type="button" class="screenshot-button ${mobile ? 'mobile' : 'desktop'}-screen" ${action} aria-label="${esc(`${t(embedded ? 'open' : 'enlarge')}: ${label}`)}" aria-haspopup="dialog">${makeImage(image)}<span class="zoom-mark">${icon('expand')}</span></button>`;
  }
  function projectCard(project, index) {
    const live = safeUrl(project.liveUrl);
    const code = safeUrl(project.codeUrl);
    const embedded = embeddedUrl(project.embedUrl);
    const hasImages = imageInfo(project.desktop) && imageInfo(project.mobile);
    const links = `${live ? `<a class="text-link" href="${esc(live)}" target="_blank" rel="noopener noreferrer">${esc(t('openSite'))}${icon('arrow-up-right')}</a>` : ''}${code ? `<a class="text-link" href="${esc(code)}" target="_blank" rel="noopener noreferrer">${esc(t('github'))}${icon('arrow-up-right')}</a>` : ''}`;
    return `<article class="project ${index % 2 ? 'project-reverse' : ''}" id="project-${esc(project.id)}" aria-labelledby="title-${esc(project.id)}">
      <div class="project-head reveal"><span class="project-number">${esc(project.number)}</span><h3 id="title-${esc(project.id)}">${esc(project.title)}</h3><span class="project-kind">${esc(project.category)}</span></div>
      <div class="project-stage reveal">${screenshot(project)}${screenshot(project, true)}<div class="stage-note"><span>${esc(t(hasImages ? embedded ? 'clickOpen' : 'clickEnlarge' : 'previewSoon'))}</span><span>${esc(t(hasImages ? 'devices' : 'realScreens'))}</span></div></div>
      ${hasImages ? `<p class="preview-device-note">${esc(t('previewNote'))}</p>` : ''}
      <div class="project-details reveal"><div><p class="project-description">${esc(project.description)}</p>${project.note ? `<p class="project-note">${esc(project.note)}</p>` : ''}${links ? `<div class="project-actions">${links}</div>` : ''}</div><div class="project-meta">${project.role || project.stack ? `<dl>${project.role ? `<dt>${esc(t('role'))}</dt><dd>${esc(project.role)}</dd>` : ''}${project.stack ? `<dt>${esc(t('stack'))}</dt><dd>${esc(project.stack)}</dd>` : ''}</dl>` : ''}${project.features?.length ? `<ul class="project-tasks" aria-label="${esc(t('features'))}">${project.features.map(feature => `<li>${esc(feature)}</li>`).join('')}</ul>` : ''}${project.tasks?.length ? `<ul class="project-tasks" aria-label="${esc(t('tasks'))}">${project.tasks.map(task => `<li>${esc(task)}</li>`).join('')}</ul>` : ''}${!hasImages ? `<p class="awaiting-materials">${icon('expand')}${esc(t('screenshotsSoon'))}</p>` : ''}</div></div>
    </article>`;
  }
  function renderProjects() {
    document.querySelector('#projects').innerHTML = data.projects.map((project,index) => projectCard(localProject(project), index)).join('');
  }
  const themeButton = document.querySelector('.theme-toggle');
  const languageButton = document.querySelector('.language-toggle');
  function updateThemeButton() {
    const light = document.documentElement.dataset.theme === 'light';
    themeButton.setAttribute('aria-pressed', String(light));
    themeButton.setAttribute('aria-label', t('lightTheme'));
    themeButton.title = t(light ? 'enableDark' : 'enableLight');
    themeButton.querySelector('use').setAttribute('href', light ? '#moon' : '#sun');
    document.querySelector('meta[name="theme-color"]').content = light ? '#F3F1EB' : '#242522';
  }
  themeButton.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    persist('vantak-theme', theme);
    updateThemeButton();
  });
  function applyLanguage() {
    document.documentElement.lang = language;
    document.title = t('pageTitle');
    document.querySelector('meta[name="description"]').content = t('metaDescription');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-owner-name]').forEach(el => { el.textContent = language === 'en' ? data.ownerNameEn : data.ownerName; });
    document.querySelector('[data-settings]').setAttribute('aria-label', language === 'en' ? 'Site settings' : 'Настройки сайта');
    languageButton.textContent = language === 'ru' ? 'EN' : 'RU';
    languageButton.lang = language === 'ru' ? 'en' : 'ru';
    languageButton.setAttribute('aria-label', t('switchLanguage'));
    languageButton.title = t('switchLanguage');
    menuButton.querySelector('.menu-label').textContent = t(mobileNav.hidden ? 'menu' : 'close');
    renderProjects();
    updateThemeButton();
    observeReveals();
  }
  languageButton.addEventListener('click', () => {
    language = language === 'ru' ? 'en' : 'ru';
    persist('vantak-language', language);
    applyLanguage();
  });

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function setMenu(open, restoreFocus = false) {
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.menu-label').textContent = t(open ? 'close' : 'menu');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header') && !mobileNav.hidden) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false, true); });
  const desktopMedia = matchMedia('(min-width:901px)');
  desktopMedia.addEventListener('change', event => { if (event.matches) setMenu(false); });

  const dialog = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  let imageOpener = null;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-full-image]');
    if (!button) return;
    imageOpener = button;
    lightboxImage.src = button.dataset.fullImage;
    lightboxImage.alt = button.dataset.imageAlt;
    document.querySelector('#lightbox-title').textContent = button.dataset.imageTitle;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
  document.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target.classList.contains('lightbox-content') || event.target.classList.contains('lightbox-hint')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    lightboxImage.removeAttribute('src');
    imageOpener?.focus({preventScroll:true});
  });

  const projectViewer = document.querySelector('#project-viewer');
  const viewerBody = projectViewer.querySelector('.project-viewer-body');
  const viewerScreen = projectViewer.querySelector('.project-live-screen');
  const viewerStatus = projectViewer.querySelector('.project-viewer-status');
  const previewDevices = {
    desktop: {width:1440, height:900, label:'desktop'},
    mobile: {width:390, height:844, label:'mobile'},
  };
  let projectOpener = null;
  let projectFrame = null;
  let introHandlesEscape = false;
  function fitProjectPreview() {
    if (!projectFrame) return;
    const device = previewDevices[projectViewer.dataset.device];
    const style = getComputedStyle(viewerBody);
    const availableWidth = viewerBody.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const availableHeight = viewerBody.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const scale = Math.max(0, Math.min(1, availableWidth / device.width, availableHeight / device.height));
    viewerScreen.style.width = `${device.width * scale}px`;
    viewerScreen.style.height = `${device.height * scale}px`;
    projectFrame.style.width = `${device.width}px`;
    projectFrame.style.height = `${device.height}px`;
    projectFrame.style.transform = `scale(${scale})`;
  }
  if ('ResizeObserver' in window) new ResizeObserver(fitProjectPreview).observe(viewerBody);
  else window.addEventListener('resize', fitProjectPreview);
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-project-url]');
    if (!button) return;
    const url = embeddedUrl(button.dataset.projectUrl);
    if (!url) return;
    projectOpener = button;
    const deviceName = button.dataset.projectDevice === 'mobile' ? 'mobile' : 'desktop';
    const device = previewDevices[deviceName];
    projectViewer.dataset.device = deviceName;
    document.querySelector('#project-viewer-title').textContent = button.dataset.projectTitle;
    document.querySelector('#project-viewer-device').textContent = t(device.label);
    viewerStatus.hidden = false;
    viewerStatus.textContent = t('loading');
    projectViewer.showModal();
    document.body.classList.add('modal-open');
    projectFrame = document.createElement('iframe');
    projectFrame.title = `${button.dataset.projectTitle} — ${t(device.label).toLowerCase()}`;
    projectFrame.src = url;
    projectFrame.addEventListener('load', () => {
      viewerStatus.hidden = true;
      // Escape сначала закрывает внутренний диалог или книжное интро.
      // На основной странице проекта клавиша возвращает к портфолио.
      projectFrame?.contentDocument?.addEventListener('keydown', keyEvent => {
        if (keyEvent.key !== 'Escape') return;
        if (projectFrame.contentDocument.querySelector('.intro[role="dialog"],.modal[role="dialog"],dialog[open]')) {
          introHandlesEscape = true;
          setTimeout(() => { introHandlesEscape = false; }, 0);
        } else {
          keyEvent.preventDefault();
          projectViewer.close();
        }
      }, true);
    });
    viewerScreen.append(projectFrame);
    fitProjectPreview();
  });
  projectViewer.querySelector('.project-viewer-close').addEventListener('click', () => projectViewer.close());
  projectViewer.addEventListener('cancel', event => { if (introHandlesEscape) event.preventDefault(); });
  projectViewer.addEventListener('click', event => { if (event.target === projectViewer) projectViewer.close(); });
  projectViewer.addEventListener('close', () => {
    projectFrame?.remove();
    projectFrame = null;
    introHandlesEscape = false;
    document.body.classList.remove('modal-open');
    projectOpener?.focus({preventScroll:true});
  });

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let revealObserver = null;
  function observeReveals() {
    revealObserver?.disconnect();
    if (motion.matches || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, {threshold:0.06});
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top >= window.innerHeight) el.classList.add('ready');
      revealObserver.observe(el);
    });
  }
  motion.addEventListener('change', event => {
    if (event.matches) { revealObserver?.disconnect(); document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible')); }
  });

  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => { if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
      });
    }, {rootMargin:'-20% 0px -55% 0px', threshold:0});
    ['work','about','contact'].forEach(id => navObserver.observe(document.getElementById(id)));
  }
  applyLanguage();
})();

