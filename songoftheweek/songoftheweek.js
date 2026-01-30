(() => {
  function init() {
    document.querySelectorAll(".sow-row").forEach((row) => {
      row.addEventListener("click", () => {
        const entry = row.closest(".sow-entry");
        const desc = entry?.querySelector(".sow-desc");
        if (!desc) return;

        const expanded = row.getAttribute("aria-expanded") === "true";
        row.setAttribute("aria-expanded", String(!expanded));
        desc.hidden = expanded;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
