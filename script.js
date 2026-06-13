// ------------------- PAGE READY -------------------

document.addEventListener("DOMContentLoaded", function () {
    console.log("Biography site loaded successfully.");
});


// ------------------- SCROLL SPY -------------------

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;

        if (
            pageYOffset >= sectionTop &&
            pageYOffset < sectionTop + sectionHeight
        ) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});


// ------------------- FADE IN -------------------

document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => {
        document.body.classList.add("loaded");
    });
});


// ------------------- FADE OUT NAVIGATION -------------------

document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    const isInternalPage =
        href &&
        !href.startsWith("#") &&
        !href.startsWith("mailto") &&
        !href.startsWith("http");

    if (isInternalPage) {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            document.body.classList.remove("loaded");

            setTimeout(() => {
                window.location.href = href;
            }, 450);
        });
    }
});
