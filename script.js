document.addEventListener("DOMContentLoaded", function () {
    console.log("Biography site loaded successfully.");
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop &&
            pageYOffset < sectionTop + sectionHeight) {
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

// Fade in when page loads
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});


// Fade out when clicking links
document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    // only apply to internal page links (not anchors or mailto)
    if (href && !href.startsWith("#") && !href.startsWith("mailto")) {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            document.body.classList.remove("loaded");

            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    }
});
