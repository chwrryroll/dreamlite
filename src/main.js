import { initNucleus } from "./nucleus.js";
import { initMitochondria } from "./mitochondria.js";
import { initER } from "./er.js";
import { initGolgi } from "./ga.js";
import { initLysosomes } from "./lysosome.js";
import { initVacuoles } from "./vacuoles.js";
import { initAnimalCell } from "./ac.js";
import { initPlantCell } from "./pc.js";

import { organelleInfo } from "./organelleinfo.js";

let currentOrganelle = "nucleus";

const imageMap = {
    nucleus: "./screenshots/bar_nucleus.jpg",
    mitochondria: "./screenshots/bar_mitochondria.jpg",
    er: "./screenshots/bar_er.jpg",
    ga: "./screenshots/bar_golgi.jpg",
    lysosomes: "./screenshots/bar_lysosome.jpg",
    vacuoles: "./screenshots/bar_vacuole.jpg",
    ac: "./screenshots/bar_ac.jpg",
    pc: "./screenshots/bar_pc.jpg"
};

document.addEventListener("DOMContentLoaded", () => {
    initNucleus();
    initMitochondria();
    initER();
    initGolgi();
    initLysosomes();
    initVacuoles();
    initAnimalCell();
    initPlantCell();

    setupTabs();
    setupInfoPanel();

    updateInfoPanel("nucleus");
});

function updateInfoPanel(key) {
    const data = organelleInfo[key];

    if (!data) return;

    document.getElementById("info_title").textContent =
        data.title;

    document.getElementById("info_function").textContent =
        data.function;

    const image =
        document.getElementById("info_image");

    if (image && imageMap[key]) {
        image.src = imageMap[key];
        image.alt = data.title;
    }

    const factList =
        document.getElementById("fact_list");

    factList.innerHTML = "";

    data.facts.forEach(fact => {
        const li =
            document.createElement("li");

        li.textContent = fact;

        factList.appendChild(li);
    });

    currentOrganelle = key;
}

function setupInfoPanel() {
    const panel =
        document.getElementById("info_panel");

    const openBtn =
        document.getElementById("info_btn");

    const closeBtn =
        document.getElementById("close_info");

    if (!panel || !openBtn || !closeBtn) return;

    openBtn.addEventListener("click", () => {
        updateInfoPanel(currentOrganelle);
        panel.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
        panel.classList.remove("open");
    });
}

function setupTabs() {
    const buttons =
        document.querySelectorAll("#cell_bar button");

    const containers =
        document.querySelectorAll(".codia");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b =>
                b.classList.remove("active")
            );

            containers.forEach(c =>
                c.classList.remove("active")
            );

            btn.classList.add("active");

            const key =
                btn.id.replace("btn_", "");

            currentOrganelle = key;

            const targetContainer =
                document.getElementById(
                    key + "_dia"
                );

            if (targetContainer) {
                targetContainer.classList.add("active");

                updateInfoPanel(key);

                window.dispatchEvent(
                    new Event("resize")
                );
            }
        });
    });

    if (buttons[0]) {
        buttons[0].classList.add("active");
    }

    const nucleusContainer =
        document.getElementById("nucleus_dia");

    if (nucleusContainer) {
        nucleusContainer.classList.add("active");
    }
}