document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    // === FUNKCIA NA NAČÍTANIE STRÁNOK ===
    async function loadPage(page) {
        try {
            const response = await fetch(`pages/${page}`);
            if (!response.ok) throw new Error("Nepodarilo sa načítať " + page);
            const html = await response.text();
            content.innerHTML = html;

            // inicializuj špecifické funkcie po načítaní konkrétnej stránky
            if (page === "gallery.html") initGallery();
        } catch (err) {
            content.innerHTML = `<p style="color:red;">Chyba: ${err.message}</p>`;
            console.error(err);
        }
    }

    // === NAVIGÁCIA (SPA prepínanie podstránok) ===
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page) loadPage(page);
        });
    });

    // načíta predvolenú stránku
    loadPage("about_me.html");

    // === FUNKCIA PRE GALÉRIU ===
    function initGallery() {
        const modal = document.getElementById("imageModal");
        if (!modal) return;

        const modalImg = document.getElementById("modalImage");
        const images = document.querySelectorAll(".gallery-item img");
        const closeBtn = modal.querySelector(".close");
        const prev = modal.querySelector(".prev");
        const next = modal.querySelector(".next");

        let currentIndex = 0;

        images.forEach((img, index) => {
            img.addEventListener("click", () => {
                modal.style.display = "block";
                modalImg.src = img.src;
                currentIndex = index;
            });
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });

        prev.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            modalImg.src = images[currentIndex].src;
        });

        next.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            modalImg.src = images[currentIndex].src;
        });
    }

    // === HAMBURGER MENU ===
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const icon = hamburger?.querySelector("i");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
        if (navLinks.classList.contains("active")) {
            const closeBtn = document.createElement("span");
            closeBtn.textContent = "✖"; // môžeš použiť aj fa-xmark
            closeBtn.style.position = "absolute";
            closeBtn.style.top = "10px";
            closeBtn.style.right = "15px";
            closeBtn.style.cursor = "pointer";
            closeBtn.style.fontSize = "1.5rem";
            closeBtn.style.color = "#000";
            closeBtn.style.zIndex = "1001";

            // pridaj krížik do nav-links
            navLinks.appendChild(closeBtn);

            // klik na krížik zatvorí menu
            closeBtn.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });

        }


        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                icon.classList.replace("fa-xmark", "fa-bars");
            });
        });
    }
});
