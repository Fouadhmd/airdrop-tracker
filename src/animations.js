import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function animateHero(title, sub, actions, stats) {
  if (reduced()) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo(title, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 });
  tl.fromTo(sub, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.9');
  tl.fromTo(actions, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.8');
  tl.fromTo(stats, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, stagger: 0.1 }, '-=0.7');
}

export function animateCards(cards) {
  if (reduced() || !cards.length) return;
  gsap.fromTo(cards, 
    { y: 50, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      stagger: 0.1, 
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 90%',
      }
    }
  );
}

export function animateModal(modal, back) {
  if (reduced()) return;
  const tl = gsap.timeline();
  tl.fromTo(back, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  tl.fromTo(modal, { y: 50, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2');
}
