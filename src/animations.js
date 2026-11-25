import gsap from 'gsap';

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function enterPage() {
  if (reduced()) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-kicker', { y: 16, opacity: 0, duration: 0.45 })
    .from('.hero-title', { y: 28, opacity: 0, duration: 0.7 }, '-=0.25')
    .from('.hero-sub', { y: 18, opacity: 0, duration: 0.5 }, '-=0.45')
    .from('.hero-actions > *', { y: 14, opacity: 0, stagger: 0.06, duration: 0.4 }, '-=0.35')
    .from('.stat-card', { y: 24, opacity: 0, scale: 0.96, stagger: 0.07, duration: 0.5 }, '-=0.25')
    .from('.toolbar', { y: 16, opacity: 0, duration: 0.45 }, '-=0.3')
    .from('.card, .empty-state', { y: 26, opacity: 0, stagger: 0.07, duration: 0.5 }, '-=0.25');
}

export function animateListIn() {
  if (reduced()) return;
  gsap.fromTo(
    '.card, .empty-state',
    { y: 24, opacity: 0, scale: 0.985 },
    { y: 0, opacity: 1, scale: 1, stagger: 0.055, duration: 0.45, ease: 'power3.out', clearProps: 'transform,opacity' }
  );
}

export function animateModal() {
  if (reduced()) return;
  gsap.fromTo('.modal-back', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' });
  gsap.fromTo(
    '.modal',
    { y: 28, opacity: 0, scale: 0.96 },
    { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
  );
}

export function pulse(el) {
  if (reduced() || !el) return;
  gsap.fromTo(el, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
}
