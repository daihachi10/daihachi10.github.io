document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // --- Hero Section Animation ---
  const title = document.querySelector(".main-title");
  const titleText = "Gemini CLI";
  title.innerHTML = titleText
    .split("")
    .map((char) => `<span class="char">${char}</span>`)
    .join("");

  const heroTimeline = gsap.timeline({ delay: 0.5 });
  heroTimeline
    .to(".hero-background", { duration: 2, scale: 1.1, ease: "power2.inOut" })
    .to(
      ".char",
      {
        duration: 1.5,
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
      },
      "-=.5"
    )
    .to(
      ".subtitle",
      { duration: 1, opacity: 1, y: 0, ease: "power3.out" },
      "-=.8"
    );

  // --- General Scroll-Triggered Animations ---
  const animateIn = (element, vars) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      ...vars,
    });
  };

  gsap.from(".section-title span", {
    scrollTrigger: {
      trigger: ".section-title",
      start: "top 90%",
      toggleActions: "play none none none",
    },
    yPercent: 100,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1,
  });

  gsap.from(".section-title::after", {
    scrollTrigger: {
      trigger: ".section-title",
      start: "top 90%",
      toggleActions: "play none none none",
    },
    scaleX: 0,
    duration: 1,
    ease: "power3.out",
  });

  // Features Section Animation
  const featuresSection = document.querySelector(".features");
  const featureCards = gsap.utils.toArray(".feature-card");

  gsap.set(featureCards, { x: 100, opacity: 0 }); // Initial state for animation

  const featuresTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: featuresSection,
      start: "top 80%",
      end: "bottom top",
      toggleActions: "play none none none",
      onEnter: () => {
        gsap.to(featuresSection.querySelector(".features-grid"), {
          overflowX: "auto",
          duration: 0.1,
        });
      },
      onLeaveBack: () => {
        gsap.to(featuresSection.querySelector(".features-grid"), {
          overflowX: "hidden",
          duration: 0.1,
        });
      },
    },
  });

  featuresTimeline.to(featureCards, {
    x: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });
  document
    .querySelectorAll(".timeline-item")
    .forEach((item) => animateIn(item, { stagger: 0.2 }));
  animateIn(".cta h2");
  animateIn(".cta p", { delay: 0.2 });
  animateIn(".cta-button", { delay: 0.4 });

  // --- CLI Demo Animation ---
  // Demo Section CLI Animation
  const cliTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".demo",
      start: "top 60%",
      toggleActions: "play none none none",
    },
  });

  const command =
    'gemini refactor --file src/auth.py --prompt "Use the requests library instead of urllib"';
  const output = `
Okay, I can refactor 'src/auth.py'.
First, I'll analyze the code and check for a test safety net...

[tool_call: read_file for absolute_path '/path/to/src/auth.py']
[tool_call: read_file for absolute_path '/path/to/tests/test_auth.py']

Analysis complete. Refactoring now...
[tool_call: replace to apply the refactoring to 'src/auth.py']

Refactoring complete. Running verification...
[tool_call: run_shell_command for 'pytest']

All checks passed. The code has been successfully refactored and verified.
`;

  cliTimeline
    .to("#cli-command", {
      duration: 3,
      text: command,
      ease: "none",
    })
    .to(
      "#cli-output",
      {
        duration: 5,
        text: output,
        ease: "none",
      },
      "+=1"
    );

  // --- Language Switcher ---
  const langButtons = {
    jp: document.getElementById("lang-jp"),
    en: document.getElementById("lang-en"),
  };
  const translatableElements = document.querySelectorAll("[data-en], [data-en-full]");

  const switchLang = (lang) => {
    translatableElements.forEach((el) => {
      // Handle elements with data-en-full/data-jp-full for dynamic command insertion
      if (el.dataset[lang + 'full']) {
        const fullText = el.dataset[lang + 'full'];
        const inlineCodeSpan = el.querySelector('.inline-code');
        if (inlineCodeSpan) {
          const commandText = inlineCodeSpan.dataset[lang + 'command'];
          el.innerHTML = fullText.replace('{command}', `<span class="inline-code">${commandText}</span>`);
        } else {
          el.innerHTML = fullText; // Fallback if no inline-code span is found
        }
      } else {
        // Existing logic for other translatable elements
        el.innerHTML = el.dataset[lang];
      }
    });
    const titleText = lang === "en" ? "Gemini CLI" : "Gemini CLI";
    title.innerHTML = titleText
      .split("")
      .map((char) => `<span class="char">${char}</span>`)
      .join("");

    heroTimeline.clear().to(".char", {
      duration: 1.5,
      opacity: 1,
      y: 0,
      scale: 1,
      rotateZ: 0,
      stagger: 0.1,
      ease: "elastic.out(1, 0.5)",
    });

    langButtons.jp.classList.toggle("active", lang === "jp");
    langButtons.en.classList.toggle("active", lang === "en");
  };

  langButtons.jp.addEventListener("click", () => switchLang("jp"));
  langButtons.en.addEventListener("click", () => switchLang("en"));

  // Set initial language
  switchLang("jp");

  // --- Feature Card Accordion ---
  // featureCards is already defined globally by gsap.utils.toArray('.feature-card');
  featureCards.forEach((card) => {
    const header = card.querySelector(".feature-header");
    header.addEventListener("click", () => {
      const isActive = card.classList.contains("active");
      // Close all other open cards
      document
        .querySelectorAll(".feature-card")
        .forEach((item) => item.classList.remove("active"));
      // Toggle current card
      if (!isActive) {
        card.classList.add("active");
      }
    });
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach((i) => i.classList.remove("active"));
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
});
