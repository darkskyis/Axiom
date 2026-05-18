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

      const fields = {
        name: form.querySelector("[name='name']")?.value || "",
        email: form.querySelector("[name='email']")?.value || "",
        phone: form.querySelector("[name='phone']")?.value || "",
        country: form.querySelector("[name='country']")?.value || "",
        matterType: form.querySelector("[name='matterType']")?.value || "",
        urgency: form.querySelector("[name='urgency']")?.value || "",
        contactMethod: form.querySelector("[name='contactMethod']")?.value || "",
        summary: form.querySelector("[name='summary']")?.value || ""
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "consultation_form_submit",
        matterType: fields.matterType,
        country: fields.country,
        path: window.location.pathname
      });

      const message = form.querySelector("[data-success-message]");
      const inquiryEmail = "axiom.law.pakistan@gmail.com";
      const subject = "Private consultation inquiry - Axiom Chambers";
      const rows = [
        ["Full name", fields.name],
        ["Email", fields.email],
        ["Phone / WhatsApp", fields.phone],
        ["City / country", fields.country],
        ["Matter type", fields.matterType],
        ["Urgency", fields.urgency],
        ["Preferred contact method", fields.contactMethod],
        ["Confidential matter summary", fields.summary]
      ];
      const labelWidth = Math.max.apply(null, rows.map(function ([label]) {
        return label.length;
      }));
      const valueWidth = 64;
      const border = "+" + "-".repeat(labelWidth + 2) + "+" + "-".repeat(valueWidth + 2) + "+";
      const tableRows = rows.map(function ([label, value]) {
        const cleanValue = String(value).replace(/\r?\n/g, " ").trim();
        return "| " + label.padEnd(labelWidth, " ") + " | " + cleanValue.padEnd(valueWidth, " ").slice(0, valueWidth) + " |";
      });
      const longSummary = fields.summary.length > valueWidth
        ? "\n\nFull confidential matter summary:\n" + fields.summary
        : "";
      const emailBody = [
        "Axiom Chambers - Private Consultation Inquiry",
        "",
        border,
        "| " + "Field".padEnd(labelWidth, " ") + " | " + "Client Response".padEnd(valueWidth, " ") + " |",
        border,
        tableRows.join("\n"),
        border,
        longSummary,
        "",
        "Disclaimer: Submitting this inquiry does not create a lawyer-client relationship until formally accepted by the firm."
      ].filter(Boolean).join("\n");

      if (message) {
        message.classList.add("visible");
        message.focus();
      }
      window.location.href = "mailto:" + inquiryEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(emailBody);
      form.reset();
    });
  });

  function setupInsightTabs() {
    const insightTabs = document.querySelectorAll("[data-insight-tab]");
    const insightPanels = document.querySelectorAll("[data-insight-panel]");

    if (!insightTabs.length || !insightPanels.length) {
      return;
    }

    function activateInsight(tabName) {
      const matchingPanel = document.querySelector('[data-insight-panel="' + tabName + '"]');
      if (!matchingPanel) {
        return;
      }

      insightTabs.forEach(function (tab) {
        const isActive = tab.getAttribute("data-insight-tab") === tabName;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });

      insightPanels.forEach(function (panel) {
        panel.classList.toggle("active", panel.getAttribute("data-insight-panel") === tabName);
      });
    }

    const initialTab = window.location.hash.replace("#", "");
    if (initialTab) {
      activateInsight(initialTab);
    }

    insightTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const tabName = tab.getAttribute("data-insight-tab");
        activateInsight(tabName);
        window.history.replaceState(null, "", "#" + tabName);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "insight_tab_open",
          topic: tabName,
          path: window.location.pathname
        });
      });
    });
  }

  setupInsightTabs();
})();
