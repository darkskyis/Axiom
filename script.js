(function () {
  const body = document.body;
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const isOpen = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.matches("a")) {
        body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-track]").forEach(function (element) {
    element.addEventListener("click", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: element.getAttribute("data-track"),
        label: element.textContent.trim(),
        path: window.location.pathname
      });
    });
  });

  document.querySelectorAll("[data-consultation-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const inquiryEmail = "axiom.law.pakistan@gmail.com";
      const fields = {
        "Full name": form.querySelector("[name='name']")?.value || "",
        "Email": form.querySelector("[name='email']")?.value || "",
        "Phone / WhatsApp": form.querySelector("[name='phone']")?.value || "",
        "City / country": form.querySelector("[name='country']")?.value || "",
        "Matter type": form.querySelector("[name='matterType']")?.value || "",
        "Urgency": form.querySelector("[name='urgency']")?.value || "",
        "Preferred contact method": form.querySelector("[name='contactMethod']")?.value || "",
        "Confidential matter summary": form.querySelector("[name='summary']")?.value || ""
      };
      const subject = "Private consultation inquiry - Axiom Chambers";
      const body = Object.entries(fields)
        .map(function ([label, value]) {
          return label + ":\n" + value;
        })
        .join("\n\n");

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "consultation_form_submit",
        matterType: fields["Matter type"],
        country: fields["City / country"],
        path: window.location.pathname
      });

      const message = form.querySelector("[data-success-message]");
      if (message) {
        message.classList.add("visible");
        message.focus();
      }
      window.location.href = "mailto:" + inquiryEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      form.reset();
    });
  });
})();
