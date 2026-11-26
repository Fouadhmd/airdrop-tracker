import gsap from 'gsap';

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function animateHero(titleRef, subtitleRef, actionsRef, statsRef) {
  if (reduced()) { return; }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(titleRef.current, { y: 30, opacity: 0, duration: 0.8 });
  tl.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4');
  tl.from(actionsRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
  tl.from(statsRef.current, { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.4');
}

export function animateModal(modalRef, overlayRef) {
  if (reduced()) { return; }
  gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
  gsap.from(modalRef.current, { scale: 0.92, opacity: 0, duration: 0.5, ease: 'back.out(1.4)' });
}

export function initParallax(cardRef) {
  if (reduced() || !cardRef.current) return;
  const card = cardRef.current;
  const bounds = card.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const handleMove = (e) => {
    const dx = (e.clientX - centerX) / (bounds.width / 2);
    const dy = (e.clientY - centerY) / (bounds.height / 2);
    gsap.to(card, { rotateY: dx * 3, rotateX: -dy * 3, duration: 0.4, ease: 'power2.out' });
  };
  const handleLeave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  card.addEventListener('mousemove', handleMove);
  card.addEventListener('mouseleave', handleLeave);
  return () => { card.removeEventListener('mousemove', handleMove); card.removeEventListener('mouseleave', handleLeave); };
}

export function staggerCards(cardRefs, filterChanged = false) {
  if (reduced()) return;
  gsap.from(cardRefs, {
    y: filterChanged ? 20 : 40,
    opacity: 0,
    duration: filterChanged ? 0.4 : 0.6,
    stagger: 0.05,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
  });
}