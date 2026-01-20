(() => {
  function initSteamhappySlideshow() {
    const img = document.getElementById("steamhappySlide");
    if (!img) return;

    // Put your images/gifs here (paths are relative to index.html)
    const slides = [
      "slide/steamhappy.gif",
      "slide/beer.png",
      "slide/winrar.jpg",
      "slide/caramelldansen.gif",
      "slide/spongebob.gif",
      "slide/int.jpg",
      "slide/demon.png",
    ];

    if (!slides.length) return;

    let i = 0;

    function show(idx) {
      const next = slides[idx % slides.length];

      // preload to reduce flicker
      const pre = new Image();
      pre.onload = () => { img.src = next; };
      pre.src = next;
    }

    show(i);

    setInterval(() => {
      i = (i + 1) % slides.length;
      show(i);
    }, 3000);
  }

  // run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSteamhappySlideshow);
  } else {
    initSteamhappySlideshow();
  }
})();
