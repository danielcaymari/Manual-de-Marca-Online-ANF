/**
 * ANF AC — MANUAL DE MARCA
 * main.js — v2.1 (corregido)
 */

document.addEventListener("DOMContentLoaded", () => {

    // Bandera para evitar que el scrollspy pise los clics del nav
    let isScrollingFromClick = false;

    // ==========================================================================
    // 1. REFERENCIAS DOM
    // ==========================================================================
    const sidebar              = document.getElementById("sidebar");
    const menuToggleMobile     = document.getElementById("menuToggle");
    const sidebarToggleDesktop = document.getElementById("sidebarToggle");
    const sidebarOverlay       = document.getElementById("sidebarOverlay");
    const navLinks             = document.querySelectorAll(".nav-list a");

    // Guard: si algún elemento crítico no existe, salir
    if (!sidebar || !sidebarOverlay) return;

    // ==========================================================================
    // 2. SIDEBAR DESKTOP — Colapsar / Expandir
    // ==========================================================================
    if (sidebarToggleDesktop) {
        sidebarToggleDesktop.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("collapsed");
        });
    }

    // ==========================================================================
    // 3. SIDEBAR MÓVIL — Apertura / Cierre + Overlay
    // ==========================================================================
    function openSidebar() {
        sidebar.classList.add("open");
        if (menuToggleMobile) menuToggleMobile.classList.add("is-open");

        // Mostrar overlay con transición
        sidebarOverlay.style.display = "block";
        // Doble rAF para garantizar que el display:block se pinte antes del fade
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                sidebarOverlay.style.opacity = "1";
            });
        });

        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        if (menuToggleMobile) menuToggleMobile.classList.remove("is-open");

        sidebarOverlay.style.opacity = "0";
        document.body.style.overflow = "";

        // Ocultar overlay tras la transición CSS (300ms)
        setTimeout(() => {
            if (!sidebar.classList.contains("open")) {
                sidebarOverlay.style.display = "none";
            }
        }, 340);
    }

    // Botón hamburguesa
    if (menuToggleMobile) {
        menuToggleMobile.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
        });
    }

    // Cerrar al tocar el overlay
    sidebarOverlay.addEventListener("click", closeSidebar);

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sidebar.classList.contains("open")) {
            closeSidebar();
        }
    });

    // ==========================================================================
    // 4. NAVEGACIÓN — Enlace activo + cerrar sidebar en móvil
    // ==========================================================================
    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            isScrollingFromClick = true;

            navLinks.forEach((item) => item.classList.remove("active"));
            this.classList.add("active");

            // Cerrar sidebar en móvil al navegar
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }

            // Liberar bandera tras el scroll animado (~800ms)
            setTimeout(() => {
                isScrollingFromClick = false;
            }, 900);
        });
    });

    // ==========================================================================
    // 5. FADE IN ON SCROLL
    // ==========================================================================
    const fadeElements = document.querySelectorAll(".fade-in");

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        );

        fadeElements.forEach((el) => fadeObserver.observe(el));
    }

    // ==========================================================================
    // 6. SCROLL SPY — Actualizar enlace activo al hacer scroll
    // ==========================================================================
    const sections = document.querySelectorAll("main section[id]");

    if (sections.length > 0 && navLinks.length > 0) {
        const spyObserver = new IntersectionObserver(
            (entries) => {
                if (isScrollingFromClick) return;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("id");
                        navLinks.forEach((link) => {
                            link.classList.remove("active");
                            if (link.getAttribute("href") === `#${id}`) {
                                link.classList.add("active");
                            }
                        });
                    }
                });
            },
            { rootMargin: "-28% 0px -62% 0px", threshold: 0 }
        );

        sections.forEach((section) => spyObserver.observe(section));
    }

    // ==========================================================================
    // 7. LOGOTIPO STICKY INTERACTIVO
    // ==========================================================================
    const logoSteps            = document.querySelectorAll(".logo-step");
    const interactiveLogo      = document.getElementById("interactiveLogo");
    const logoDisplayContainer = document.getElementById("logoDisplayContainer");

    if (interactiveLogo && logoDisplayContainer && logoSteps.length > 0) {
        const logoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const scale  = entry.target.getAttribute("data-scale")  || "1";
                        const rotate = entry.target.getAttribute("data-rotate") || "0";
                        const invert = entry.target.getAttribute("data-invert") || "0";

                        interactiveLogo.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

                        if (invert === "1") {
                            logoDisplayContainer.style.backgroundColor = "var(--blue-3)";
                            interactiveLogo.style.filter = "brightness(0) invert(1)";
                            logoDisplayContainer.style.boxShadow =
                                "0 16px 40px -10px rgba(34,50,97,0.35)";
                        } else {
                            logoDisplayContainer.style.backgroundColor = "#FFFFFF";
                            interactiveLogo.style.filter = "none";
                            logoDisplayContainer.style.boxShadow =
                                "0 8px 32px -10px rgba(0,0,0,0.07)";
                        }
                    }
                });
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );

        logoSteps.forEach((step) => logoObserver.observe(step));
    }

    // ==========================================================================
    // 8. COLOR STICKY FULLSCREEN
    // ==========================================================================
    const colorSticky   = document.getElementById("colorSticky");
    const colorHex      = document.querySelector(".color-hex");
    const colorDetails  = document.querySelector(".color-details");
    const colorTriggers = document.querySelectorAll(".color-trigger");

    if (colorSticky && colorHex && colorDetails && colorTriggers.length > 0) {
        const colorObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bg      = entry.target.getAttribute("data-bg");
                        const name    = entry.target.getAttribute("data-name");
                        const textCol = entry.target.getAttribute("data-text");

                        colorSticky.style.backgroundColor = bg;

                        // Fade out → actualizar texto → fade in
                        colorHex.style.opacity     = "0";
                        colorDetails.style.opacity = "0";

                        setTimeout(() => {
                            colorHex.style.color     = textCol;
                            colorDetails.style.color = textCol;
                            colorHex.textContent     = bg;
                            colorDetails.textContent = name;

                            colorHex.style.opacity     = "1";
                            colorDetails.style.opacity = "0.85";
                        }, 230);
                    }
                });
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );

        colorTriggers.forEach((trigger) => colorObserver.observe(trigger));
    }

    // ==========================================================================
    // 9. TIPOGRAFÍA SPLIT STICKY
    // ==========================================================================
    const typoSteps  = document.querySelectorAll(".typo-step");
    const typoLetter = document.getElementById("typoLetter");

    if (typoLetter && typoSteps.length > 0) {
        const typoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const font   = entry.target.getAttribute("data-font");
                        const letter = entry.target.getAttribute("data-letter");

                        typoLetter.style.opacity = "0";

                        setTimeout(() => {
                            typoLetter.style.fontFamily = font;
                            typoLetter.textContent      = letter;
                            typoLetter.style.opacity    = "1";
                        }, 200);
                    }
                });
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );

        typoSteps.forEach((step) => typoObserver.observe(step));
    }

    // ==========================================================================
    // 10. RESIZE — Limpiar estado móvil si se amplía la ventana
    // ==========================================================================
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024) {
                // Si estaba abierto en móvil, cerrarlo limpiamente
                if (sidebar.classList.contains("open")) {
                    closeSidebar();
                }
                // Restaurar scroll del body por si quedó bloqueado
                document.body.style.overflow = "";
            }
        }, 160);
    });

});