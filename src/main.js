import { initNucleus } from "./nucleus.js";
import { initMitochondria } from "./mitochondria.js";
import { initER } from "./er.js";
import { initGolgi } from "./ga.js";
import { initLysosomes } from "./lysosome.js";
import { initVacuoles } from "./vacuoles.js";
import { initAnimalCell } from "./ac.js";
import { initPlantCell } from "./pc.js";

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
});

function setupTabs() {
    const buttons = document.querySelectorAll("#cell_bar button");
    const containers = document.querySelectorAll(".codia");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            buttons.forEach(b =>
                b.classList.remove("active")
            );

            containers.forEach(c =>
                c.classList.remove("active")
            );

            btn.classList.add("active");

            const targetId =
                btn.id.replace("btn_", "") + "_dia";

            const targetContainer =
                document.getElementById(targetId);

            if (targetContainer) {
                targetContainer.classList.add("active");
                window.dispatchEvent(new Event("resize"));
            }
        });
    });

    if (buttons[0]) {
        buttons[0].classList.add("active");
    }
}