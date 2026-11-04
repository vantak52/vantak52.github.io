(() => {
  'use strict';
  const data = window.PORTFOLIO;
  if (!data) return;
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
    return `<div class="screen-placeholder ${mobile ? 'mobile' : 'desktop'}-placeholder"><span class="placeholder-number" aria-hidden="true">${esc(project.number)}</span><span class="placeholder-name">${esc(project.title)}</span><span class="placeholder-caption">${mobile ? 'Место для мобильного экрана' : 'Место для скриншота проекта'}</span><span class="placeholder-device">${mobile ? 'Телефон' : 'Компьютерная версия'}</span></div>`;
  }
  function screenshot(project, mobile = false) {
    const image = imageInfo(mobile ? project.mobile : project.desktop);
    if (!image) return placeholder(project, mobile);
    const label = `${project.title} — ${mobile ? 'мобильная' : 'компьютерная'} версия`;
    const embedded = embeddedUrl(project.embedUrl);
    const action = embedded
      ? `data-project-url="${esc(embedded)}" data-project-title="${esc(project.title)}" data-project-device="${mobile ? 'mobile' : 'desktop'}"`
      : `data-full-image="${esc(safeUrl(image.full, true) || image.src)}" data-image-alt="${esc(image.alt || label)}" data-image-title="${esc(label)}"`;
    return `<button type="button" class="screenshot-button ${mobile ? 'mobile' : 'desktop'}-screen" ${action} aria-label="${esc(`${embedded ? 'Открыть' : 'Увеличить'}: ${label}`)}" aria-haspopup="dialog">${makeImage(image)}<span class="zoom-mark">${icon('expand')}</span></button>`;
  }
  function projectCard(project, index) {
    const live = safeUrl(project.liveUrl);
    const code = safeUrl(project.codeUrl);
    const embedded = embeddedUrl(project.embedUrl);
    const hasImages = imageInfo(project.desktop) && imageInfo(project.mobile);
    const links = `${live ? `<a class="text-link" href="${esc(live)}" target="_blank" rel="noopener noreferrer">Открыть сайт${icon('arrow-up-right')}</a>` : ''}${code ? `<a class="text-link" href="${esc(code)}" target="_blank" rel="noopener noreferrer">Код на GitHub${icon('arrow-up-right')}</a>` : ''}`;
    return `<article class="project ${index % 2 ? 'project-reverse' : ''}" id="project-${esc(project.id)}" aria-labelledby="title-${esc(project.id)}">
      <div class="project-head reveal"><span class="project-number">${esc(project.number)}</span><h3 id="title-${esc(project.id)}">${esc(project.title)}</h3><span class="project-kind">${esc(project.category)}</span></div>
      <div class="project-stage reveal">${screenshot(project)}${screenshot(project, true)}<div class="stage-note"><span>${hasImages ? embedded ? 'Нажми на экран, чтобы открыть сайт' : 'Нажми на экран, чтобы рассмотреть' : 'Превью готовится'}</span><span>${hasImages ? 'Компьютер + телефон' : 'Реальные экраны будут здесь'}</span></div></div>
      <div class="project-details reveal"><div><p class="project-description">${esc(project.description)}</p>${project.note ? `<p class="project-note">${esc(project.note)}</p>` : ''}${links ? `<div class="project-actions">${links}</div>` : ''}</div><div class="project-meta">${project.role || project.stack ? `<dl>${project.role ? `<dt>Моя роль</dt><dd>${esc(project.role)}</dd>` : ''}${project.stack ? `<dt>Технологии</dt><dd>${esc(project.stack)}</dd>` : ''}</dl>` : ''}${project.features?.length ? `<ul class="project-tasks" aria-label="Особенности проекта">${project.features.map(feature => `<li>${esc(feature)}</li>`).join('')}</ul>` : ''}${project.tasks?.length ? `<ul class="project-tasks" aria-label="Выполненные задачи">${project.tasks.map(task => `<li>${esc(task)}</li>`).join('')}</ul>` : ''}${!hasImages ? `<p class="awaiting-materials">${icon('expand')}Скриншоты готовятся к добавлению</p>` : ''}</div></div>
    </article>`;
  }
  document.querySelector('#projects').innerHTML = data.projects.map(projectCard).join('');

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function setMenu(open, restoreFocus = false) {
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.menu-label').textContent = open ? 'Закрыть' : 'Меню';
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header') && !mobileNav.hidden) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false, true); });
  const desktopMedia = matchMedia('(min-width:681px)');
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
    desktop: {width:1440, height:900, label:'Компьютерная версия'},
    mobile: {width:390, height:844, label:'Мобильная версия'},
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
    document.querySelector('#project-viewer-device').textContent = device.label;
    viewerStatus.hidden = false;
    viewerStatus.textContent = 'Загружаю проект…';
    projectViewer.showModal();
    document.body.classList.add('modal-open');
    projectFrame = document.createElement('iframe');
    projectFrame.title = `${button.dataset.projectTitle} — ${device.label.toLowerCase()}`;
    projectFrame.src = url;
    projectFrame.addEventListener('load', () => {
      viewerStatus.hidden = true;
      // Escape в книжном интро сначала пропускает интро. На основном сайте
      // та же клавиша закрывает просмотр и возвращает фокус в портфолио.
      projectFrame?.contentDocument?.addEventListener('keydown', keyEvent => {
        if (keyEvent.key !== 'Escape') return;
        if (projectFrame.contentDocument.querySelector('.intro[role="dialog"]')) {
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

  // Анимации включаются только после отрисовки и никогда не скрывают первый экран.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, {threshold:0.06});
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top >= window.innerHeight) el.classList.add('ready');
      observer.observe(el);
    });
    motion.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible')); }
    });
  }

  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => { if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
      });
    }, {rootMargin:'-20% 0px -55% 0px', threshold:0});
    ['work','about','contact'].forEach(id => navObserver.observe(document.getElementById(id)));
  }
})();

