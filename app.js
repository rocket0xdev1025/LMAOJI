"use strict";
(() => {
  const config = window.LMAOJI_CONFIG || {};
  document.documentElement.classList.toggle(
    "glove-cursor",
    config.CUSTOM_CURSOR !== false
  );
  const toast = document.querySelector(".toast");
  let toastTimer;
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
  }
  function https(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }
  const ca = String(config.CONTRACT_ADDRESS || "").trim();
  const contract = document.querySelector("[data-contract]");
  if (contract && ca) {
    contract.textContent = ca;
    contract.title = ca;
  }
  const urls = {
    x: https(config.X_URL),
    pump: https(
      config.PUMP_URL ||
        (ca
          ? String(
              config.PUMP_URL_TEMPLATE || "https://pump.fun/coin/{CA}"
            ).replace("{CA}", encodeURIComponent(ca))
          : "")
    ),
  };
  document.querySelectorAll("[data-external]").forEach((link) => {
    const url = urls[link.dataset.external];
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
    } else {
      const message =
        link.dataset.external === "x"
          ? "Our X link is coming soon."
          : "Our Pump.fun link is coming soon.";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        notify(message);
      });
      link.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          notify(message);
        }
      });
    }
  });
  document.querySelector(".copy-ca")?.addEventListener("click", async () => {
    if (!ca) {
      notify("Contract address coming soon.");
      return;
    }
    try {
      await navigator.clipboard.writeText(ca);
      notify("Contract address copied!");
    } catch {
      notify("Select the contract address to copy it.");
    }
  });
  document.documentElement.classList.add("ready");
})();
