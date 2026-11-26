import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function animateHero(title, sub, actions, stats) {
  if (reduced()) { return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo(title, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 });
  tl.fromTo(sub, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.9');
  tl.fromTo(actions, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.8');
  tl.fromTo(stats, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, stagger: 0.1 }, '-=0.7');
}

export function animateCards(cards) {
  if (reduced() || !cards || !cards.length) return;
  gsap.fromTo(cards,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
  );
}

export function animateModal(modal, back) {
  if (reduced()) { return; }
  const tl = gsap.timeline();
  tl.fromTo(back, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  tl.fromTo(modal, { y: 50, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2');
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
  return () => {
    card.removeEventListener('mousemove', handleMove);
    card.removeEventListener('mouseleave', handleLeave);
  };
}