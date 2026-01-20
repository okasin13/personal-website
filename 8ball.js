(() => {
  const ANSWERS = [
    // Affirmative (Yes)
    "It is\ncertain.",
    "It is\ndecidedly so.",
    "Without\na doubt.",
    "Yes –\ndefinitely.",
    "You may\nrely on it.",
    "As I see it,\nyes.",
    "Most\nlikely.",
    "Outlook\ngood.",
    "Yes.",
    "Signs point\nto yes.",

    // Non-committal (Maybe/Later)
    "Reply hazy,\ntry again.",
    "Ask again\nlater.",
    "Better not\ntell you now.",
    "Cannot\npredict now.",
    "Concentrate\nand ask again.",

    // Negative (No)
    "Don't count\non it.",
    "My reply\nis no.",
    "My sources\nsay no.",
    "Outlook not\nso good.",
    "Very\ndoubtful."
  ];

  function initEightBall() {
    const btn = document.getElementById("eightballBtn");
    const out = document.getElementById("eightballText");
    if (!btn || !out) return;

    function pickAnswer() {
      const idx = Math.floor(Math.random() * ANSWERS.length);
      return ANSWERS[idx];
    }

    function showAnswer() {
      out.textContent = pickAnswer();

      // optional: re-trigger a CSS animation if you use .pop
      out.classList.remove("pop");
      void out.offsetWidth; // force reflow
      out.classList.add("pop");
    }

    btn.addEventListener("click", showAnswer);

    // keyboard support
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showAnswer();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEightBall);
  } else {
    initEightBall();
  }
})();
