// Mockup-only: reveal the mobile sticky CTA after the first screen.
const bar = document.querySelector('.sticky-apply');
if (bar) {
  const onScroll = () => bar.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
