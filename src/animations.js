import gsap from 'gsap';

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function enterPage() {
  if (reduced()) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-kicker', { y: 16, opacity: 0, duration: 0.5 })
    .from('.hero-title', { y: 32, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.hero-sub', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.hero-actions > *', { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.4')
    .from('.stat-card', { y: 32, opacity: 0, scale: 0.95, stagger: 0.08, duration: 0.6 }, '-=0.3')
    .from('.toolbar', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
    .from('.card, .empty-state', { y: 40, opacity: 0, stagger: 0.06, duration: 0.6 }, '-=0.3');
}

export function initParallax(element) {
  if (reduced() || !element) return;
  element.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    gsap.to(element, {
      x: x * 10,
      y: y * 10,
      rotationY: x * 5,
      rotationX: y * -5,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  element.addEventListener('mouseleave', () => {
    gsap.to(element, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power2.out' });
  });
}
