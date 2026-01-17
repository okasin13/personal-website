console.log("windows.js DEPLOY MARKER: 2026-01-17-1");

(() => {
  const desktop = document.getElementById("desktop");
  const taskbar = document.getElementById("taskbar");
  const windows = Array.from(document.querySelectorAll(".window"));

  let zTop = 100;
  //let drag = null;

  function bringToFront(win) {
    zTop += 1;
    win.style.zIndex = zTop;

    windows.forEach(w => w.classList.remove("active"));
    win.classList.add("active");

    // taskbar active state
    document.querySelectorAll(".taskbar-btn").forEach(btn => btn.classList.remove("active"));
    const btn = taskbar.querySelector(`[data-win="${win.dataset.winId}"]`);
    if (btn) btn.classList.add("active");
  }

  function minimize(win) {
    win.classList.add("hidden");
    win.dataset.minimized = "true";
    const btn = taskbar.querySelector(`[data-win="${win.dataset.winId}"]`);
    if (btn) btn.classList.add("minimized");
  }

  function close(win) {
    win.classList.add("hidden");
    win.dataset.closed = "true";
    // hide taskbar button too
    const btn = taskbar.querySelector(`[data-win="${win.dataset.winId}"]`);
    if (btn) btn.remove();
  }

  function restore(win) {
    win.classList.remove("hidden");
    win.dataset.minimized = "false";
    bringToFront(win);

    const btn = taskbar.querySelector(`[data-win="${win.dataset.winId}"]`);
    if (btn) btn.classList.remove("minimized");
  }

  function toggleMaximize(win) {
    win.classList.toggle("maximized");
    bringToFront(win);
  }

  // Setup: assign ids + create taskbar buttons
  windows.forEach((win, idx) => {
    win.dataset.winId = String(idx);

    // If you want windows to be draggable by top/left, ensure they have these:
    if (!win.style.top) win.style.top = `${80 + idx * 40}px`;
    if (!win.style.left) win.style.left = `${80 + idx * 40}px`;

    const title = win.getAttribute("data-title") || `Window ${idx}`;

    const btn = document.createElement("button");
    btn.className = "taskbar-btn";
    btn.textContent = title;
    btn.dataset.win = String(idx);
    taskbar.appendChild(btn);

    btn.addEventListener("click", () => {
      const isHidden = win.classList.contains("hidden");
      const isMin = win.dataset.minimized === "true";
      const isClosed = win.dataset.closed === "true";

      if (isClosed) return; // closed windows removed from taskbar anyway
      if (isHidden && isMin) {
        restore(win);
      } else {
        // if active => minimize, else focus
        if (win.classList.contains("active")) minimize(win);
        else bringToFront(win);
      }
    });

    // focus when clicking inside window
    win.addEventListener("mousedown", () => bringToFront(win));

    // buttons
    const minBtn = win.querySelector(".winmin");
    const closeBtn = win.querySelector(".winclose");
    const maxBtn = win.querySelector(".winmax");

    if (minBtn) minBtn.addEventListener("click", (e) => { e.stopPropagation(); minimize(win); });
    if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(win); });
    if (maxBtn) maxBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMaximize(win); });

    // drag by header
    /*
    const header = win.querySelector(".windowHeader");
    if (header) {
      header.addEventListener("pointerdown", (e) => {
        // don't start drag when clicking control buttons
        if (e.target.closest(".windowControls")) return;

        bringToFront(win);
        header.setPointerCapture(e.pointerId);

        const rect = win.getBoundingClientRect();
        drag = {
          win,
          startX: e.clientX,
          startY: e.clientY,
          origLeft: rect.left,
          origTop: rect.top
        };

        header.style.cursor = "grabbing";
      });

      header.addEventListener("pointermove", (e) => {
        if (!drag || drag.win !== win) return;

        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;

        // keep within desktop bounds (soft clamp)
        const newLeft = drag.origLeft + dx;
        const newTop = drag.origTop + dy;

        win.style.left = `${newLeft}px`;
        win.style.top = `${newTop}px`;
      });

      header.addEventListener("pointerup", () => {
        drag = null;
        header.style.cursor = "grab";
      });

      header.addEventListener("pointercancel", () => {
        drag = null;
        header.style.cursor = "grab";
      });
    }
      */
  });

  // Start with the last window active (like the example site)
  if (windows.length) bringToFront(windows[windows.length - 1]);




  function clampToViewport(win) {
  const pad = 10;
  const taskbarH = 54; // taskbar + a little spacing

  // temporarily remove maximized sizing from calc
  const wasMax = win.classList.contains("maximized");
  if (wasMax) return;

  const rect = win.getBoundingClientRect();

  // if you used inline left/top, use those; otherwise use rect positions
  let left = parseFloat(win.style.left || rect.left);
  let top  = parseFloat(win.style.top  || rect.top);

  const maxLeft = window.innerWidth - rect.width - pad;
  const maxTop  = window.innerHeight - rect.height - taskbarH - pad;

  left = Math.max(pad, Math.min(left, maxLeft));
  top  = Math.max(pad, Math.min(top, maxTop));

  win.style.left = left + "px";
  win.style.top  = top + "px";
}

function showEasterEgg() {
  const overlay = document.getElementById("eggOverlay");
  const video = document.getElementById("eggVideo");
  const closeBtn = document.getElementById("eggClose");
  if (!overlay || !video || !closeBtn) return;

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");

  // try to play; if autoplay is blocked, user can press play (controls are shown)
  video.currentTime = 0;
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
  
  const hide = () => {
    video.pause();
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  };

  // close button
  closeBtn.onclick = hide;

  // click outside the modal closes
  overlay.onclick = (e) => {
    if (e.target === overlay) hide();
  };

  // ESC closes
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") {
      hide();
      document.removeEventListener("keydown", onKey);
    }
  });
}

function checkAllClosed() {
  const allClosed = windows.every(w => w.dataset.closed === "true");
  if (allClosed) showEasterEgg();
}

function close(win) {
  win.classList.add("hidden");
  win.dataset.closed = "true";
  const btn = taskbar.querySelector(`[data-win="${win.dataset.winId}"]`);
  if (btn) btn.remove();

  checkAllClosed(); // <-- add this
}


// after your windows are initialized:
windows.forEach(clampToViewport);

window.addEventListener("resize", () => {
  windows.forEach(clampToViewport);
});

})();
