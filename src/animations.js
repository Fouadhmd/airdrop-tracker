import gsap from 'gsap';

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function enterPage() {
  if (reduced()) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-title', { y: -26, opacity: 0, duration: 0.6 })
    .from('header .actions button', { y: 10, opacity: 0, stagger: 0.05, duration: 0.35 }, '-=0.35')
    .from('.stats > div', { y: 18, opacity: 0, stagger: 0.06, duration: 0.4 }, '-=0.25')
    .from('.filters', { y: 12, opacity: 0, duration: 0.35 }, '-=0.2')
    .from('.card, .empty', { y: 22, opacity: 0, stagger: 0.06, duration: 0.45 }, '-=0.2');
}

export function animateListIn() {
  if (reduced()) return;
  gsap.fromTo(
    '.card, .empty',
    { y: 22, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power3.out', clearProps: 'transform,opacity' }
  );
}

export function animateModal() {
  if (reduced()) return;
  gsap.fromTo('.modal-back', { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
  gsap.fromTo(
    '.modal',
    { scale: 0.92, y: 18, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
  );
}
