const createElement = (
  tag,
  { className, textContent, innerHTML, onClick } = {},
) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (textContent) element.textContent = textContent;
  if (innerHTML) element.innerHTML = innerHTML;
  if (onClick) element.addEventListener("click", onClick);
  return element;
};

const createParagraphSection = (title, content) => {
  const sectionDiv = createElement("div", {
    className: "paragraph-section__paragraph",
  });
  const h2 = createElement("h2", {
    className: "paragraph__title",
    textContent: title,
  });
  const p = createElement("p", {
    className: "paragraph__text",
    innerHTML: content,
  });

  sectionDiv.appendChild(h2);
  sectionDiv.appendChild(p);
  return sectionDiv;
};

const createBottomNavigation = (currentIndex, keys, onNavigate) => {
  const footerNav = createElement("div", { className: "footer-nav" });

  if (currentIndex > 0) {
    footerNav.appendChild(
      createElement("button", {
        className: "nav-button",
        textContent: "← Anterior",
        onClick: () => onNavigate(keys[currentIndex - 1]),
      }),
    );
  }

  if (currentIndex < keys.length - 1) {
    footerNav.appendChild(
      createElement("button", {
        className: "nav-button",
        textContent: "Próximo →",
        onClick: () => onNavigate(keys[currentIndex + 1]),
      }),
    );
  }

  return footerNav;
};

const createTopNavigation = (keys, onNavigate) => {
  return keys.map((title) =>
    createElement("button", {
      className: "nav-button",
      textContent: title,
      onClick: () => onNavigate(title),
    }),
  );
};

async function loadContent() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();

    const nav = document.getElementById("section-nav");
    const container = document.querySelector(".main__paragraph-section");
    const keys = Object.keys(data);

    const displaySection = (title) => {
      const index = keys.indexOf(title);

      const currentSection = container.querySelector(
        ".paragraph-section__paragraph",
      );
      if (currentSection) currentSection.remove();

      const currentFooter = container.querySelector(".footer-nav");
      if (currentFooter) currentFooter.remove();

      container.appendChild(createParagraphSection(title, data[title]));

      container.appendChild(
        createBottomNavigation(index, keys, (newTitle) => {
          displaySection(newTitle);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }),
      );

      document.querySelectorAll("#section-nav .nav-button").forEach((btn) => {
        btn.classList.toggle("nav-button--active", btn.textContent === title);
      });
    };

    const topButtons = createTopNavigation(keys, displaySection);
    topButtons.forEach((btn) => nav.appendChild(btn));

    if (keys.length > 0) displaySection(keys[0]);
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

loadContent();
