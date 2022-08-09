/* Based off Method 4 of making cards clickable:
 * https://css-tricks.com/block-links-the-search-for-a-perfect-solution/#method-4-sprinkle-javascript-on-the-second-method
 */
(() => {
  const cards = document.querySelectorAll('.clickable\\:card');
  const secondaryLinks = document.querySelectorAll('.clickable\\:secondary');

  secondaryLinks.forEach((ele) => {
    ele.addEventListener('click', (e) => e.stopPropagation());
  });

  cards.forEach((card) => {
    card.addEventListener('click', (event) => {
      let noSelectedText = !window.getSelection().toString();

      if(noSelectedText) {
        card.querySelector('.clickable\\:main').click();
      }
    });
  })
})();
