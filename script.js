(() => {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const progress = document.querySelector(".scroll-progress");
  const updateProgress = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const toast = document.querySelector(".toast");
  let toastTimer;
  const showToast = (message, success = true) => {
    if (!toast) return;
    toast.innerHTML = `<span aria-hidden="true">${success ? "✓" : "!"}</span> ${message}`;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  };

  const copyText = async (value) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      showToast(`${value} copiado`);
    } catch {
      showToast("Não foi possível copiar", false);
    }
  };

  document.querySelectorAll(".color-card").forEach((card) => {
    const hex = card.querySelector(".copy-hex")?.textContent?.match(/#[0-9A-F]{6}/i)?.[0];
    if (!hex) return;
    card.querySelector(".color-swatch")?.addEventListener("click", () => copyText(hex));
    card.querySelector(".copy-hex")?.addEventListener("click", () => copyText(hex));
  });

  const orientationButtons = document.querySelectorAll(".segmented button");
  const setOrientation = (orientation) => {
    orientationButtons.forEach((button) => {
      button.classList.toggle("active", button.textContent.trim().toLowerCase() === orientation);
    });
    document.querySelectorAll(".logo-variant").forEach((card) => {
      const image = card.querySelector("img");
      const link = card.querySelector("a");
      if (!image || !link) return;
      const nextPath = image.getAttribute("src").replace(/hidrogest-(horizontal|vertical)-/, `hidrogest-${orientation}-`);
      image.setAttribute("src", nextPath);
      image.alt = image.alt.replace(/horizontal|vertical/i, orientation);
      link.setAttribute("href", nextPath);
    });
  };
  orientationButtons.forEach((button) => {
    button.addEventListener("click", () => setOrientation(button.textContent.trim().toLowerCase()));
  });
})();
