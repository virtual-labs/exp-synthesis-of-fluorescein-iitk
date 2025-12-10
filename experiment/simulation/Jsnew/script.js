// Experiment Steps Configuration
const STEPS = [
  {
    id: 0,
    title: "Welcome",
    instruction:
      "Click Start to begin the fluorescein synthesis experiment. Hover over equipment to learn about them.",
    action: null,
    voice:
      "Welcome to the Fluorescein Synthesis Lab. Click Start to begin the experiment.",
  },
  {
    id: 1,
    title: "Step 1: Add Magnetic Bead",
    instruction:
      "Click on the magnetic bead to add it to the round bottom flask. This will help with stirring during the reaction.",
    action: "bead",
    voice:
      "Step 1: Click on the magnetic bead to add it to the round bottom flask.",
  },
  {
    id: 2,
    title: "Step 2: Weigh Phthalic Anhydride",
    instruction:
      "Click on the Phthalic Anhydride bottle to weigh 0.5g on the digital scale.",
    action: "phthalic",
    voice:
      "Step 2: Weigh 0.5 grams of Phthalic Anhydride using the digital scale.",
  },
  {
    id: 3,
    title: "Step 3: Weigh Resorcinol",
    instruction:
      "Click on the Resorcinol bottle to weigh 0.75g and add it to the flask.",
    action: "resorcinol",
    voice: "Step 3: Weigh 0.75 grams of Resorcinol and add it to the flask.",
  },
  {
    id: 4,
    title: "Step 4: Add Sulfuric Acid",
    instruction:
      "Carefully add 2-3 drops of concentrated H₂SO₄. This acts as a catalyst for the reaction.",
    action: "h2so4",
    voice:
      "Step 4: Carefully add 2 to 3 drops of concentrated sulfuric acid. This acts as a catalyst.",
  },
  {
    id: 5,
    title: "Step 5: Heat & Stir",
    instruction:
      "Turn on the heating mantle and magnetic stirrer. Heat the mixture for 5-10 minutes until it melts and becomes dark red.",
    action: "heat",
    voice:
      "Step 5: Heat the mixture with stirring for 5 to 10 minutes until it becomes dark red.",
  },
  {
    id: 6,
    title: "Step 6: Cool & Add Water",
    instruction:
      "Allow the mixture to cool, then add distilled water to dissolve the product.",
    action: "water",
    voice:
      "Step 6: Let the mixture cool, then add distilled water to dissolve the product.",
  },
  {
    id: 7,
    title: "Step 7: Add Ammonia",
    instruction:
      "Add ammonia solution to make the solution basic. This converts fluorescein to its fluorescent form.",
    action: "ammonia",
    voice:
      "Step 7: Add ammonia solution to convert fluorescein to its fluorescent form.",
  },
  {
    id: 8,
    title: "Step 8: Pour into Water",
    instruction:
      "Pour reaction mixture into water — yellow-green solution forms.",
    action: "waterPour",
    voice: "Pour the reaction mixture into distilled water.",
  },
  {
    id: 9,
    title: "Step 9: Observe Fluorescence",
    instruction:
      "Observe the bright green fluorescence! Fluorescein absorbs UV light and emits visible green light.",
    action: "observe",
    voice:
      "Step 8: Observe the bright green fluorescence. Fluorescein absorbs ultraviolet light and emits visible green light.",
  },
  {
    id: 10,
    title: "Step 10: Column Chromatography",
    instruction: "Perform column chromatography to purify the fluorescein.",
    action: "columnChromo",
    voice: "Perform column chromatography for purification.",
  },

  {
    id: 11,
    title: "Experiment Complete!",
    instruction:
      "Congratulations! You have successfully synthesized fluorescein. This compound is used in medical diagnostics and as a tracer dye.",
    action: null,
    voice:
      "Congratulations  You have successfully synthesized fluorescein. This compound is used in medical diagnostics and as a tracer dye.",
  },
];

// State
let currentStep = 0;
let voiceEnabled = true;
let canProceed = true;
let observations = [];

// DOM Elements
const stepTitle = document.getElementById("stepTitle");
const stepInstruction = document.getElementById("stepInstruction");
const actionHint = document.getElementById("actionHint");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const voiceBtn = document.getElementById("voiceBtn");
const observationPanel = document.getElementById("observationPanel");
const observationList = document.getElementById("observationList");
const scaleDisplay = document.querySelector(".scale-display");
const flaskLiquid = document.getElementById("flaskLiquid");
const magneticBead = document.getElementById("magneticBead");
const heatingMantle = document.getElementById("heatingMantle");
const bubbles = document.getElementById("bubbles");
const mainFlask = document.getElementById("mainFlask");
const beakerLiquid = document.getElementById("beakerLiquid");
function showFlaskImage(imgNum) {
  document.getElementById("extraImg1").classList.add("hidden");
  document.getElementById("extraImg2").classList.add("hidden");
  document.getElementById("extraImg3").classList.add("hidden");
  document.getElementById("extraImg4").classList.add("hidden");
  document.getElementById("extraImg" + imgNum).classList.remove("hidden");
}

// Chemical bottles
const chemicals = {
  bead: document.getElementById("bead"),
  phthalic: document.getElementById("phthalic"),
  resorcinol: document.getElementById("resorcinol"),
  h2so4: document.getElementById("h2so4"),
  water: document.getElementById("water"),
  ammonia: document.getElementById("ammonia"),
  waterPour: document.getElementById("waterPour"),
  columnChromo: document.getElementById("columnChromo"),
};

// Flask state
let flaskContents = {
  color: "transparent",
  fillLevel: 0,
};

// Voice synthesis
function speak(text) {
  if (!voiceEnabled) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to get a good voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find((v) => v.lang.startsWith("en") && v.name.includes("Female")) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Update step indicators
function updateStepIndicators() {
  document.querySelectorAll(".step").forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (index + 1 < currentStep) {
      step.classList.add("completed");
      step.innerHTML = "✓";
    } else if (index + 1 === currentStep) {
      step.classList.add("active");
      step.innerHTML = `<span>${index + 1}</span>`;
    } else {
      step.innerHTML = `<span>${index + 1}</span>`;
    }
  });
}

// Update UI for current step
function updateUI() {
  const step = STEPS[currentStep];

  stepTitle.textContent = step.title;
  stepInstruction.textContent = step.instruction;

  // 🔥 Next Button Glow Controls
  // 🔥 Button Glow System (Glow when enabled)
  if (currentStep === 0) {
    nextBtn.textContent = "Start";
  } else if (currentStep === STEPS.length - 1) {
    nextBtn.textContent = "Restart";
  } else {
    nextBtn.textContent = "Next Step";
  }

  // Enable / Disable based on step requirement
  if (step.action && !["observe"].includes(step.action)) {
    nextBtn.disabled = true;
    nextBtn.classList.remove("glow-next");
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.add("glow-next");
  }

  // Update step indicators
  updateStepIndicators();

  // Highlight relevant chemical
  Object.values(chemicals).forEach((c) => {
    c.classList.remove("highlight");
  });

  if (step.action && chemicals[step.action]) {
    chemicals[step.action].classList.add("highlight");
    actionHint.textContent = `👆 Click on the ${
      step.action === "h2so4" ? "H₂SO₄" : step.action
    } bottle`;
    actionHint.classList.add("visible");
    canProceed = false;
    nextBtn.disabled = true;
  } else if (step.action === "heat") {
    actionHint.textContent = "🔥 Click the flask to heat & stir";
    actionHint.classList.add("visible");
    highlightFlaskClick(); // highlight flask now
    canProceed = false;
    nextBtn.disabled = true;
  } else if (step.action === "observe") {
    performObserve();
    actionHint.classList.remove("visible");
    canProceed = true;
    nextBtn.disabled = false;
  } else {
    actionHint.classList.remove("visible");
    canProceed = true;
    nextBtn.disabled = false;
  }

  // Speak the instruction
  speak(step.voice);
}

// Add observation
function addObservation(text) {
  observations.push(text);
  const li = document.createElement("li");
  li.textContent = text;
  observationList.appendChild(li);
  observationPanel.classList.add("visible");
}

// Update flask appearance

// Create bubbles

// Remove bubbles

// Chemical click handlers
function handleChemicalClick(chemicalId) {
  const step = STEPS[currentStep];

  if (step.action !== chemicalId) return;

  chemicals[chemicalId].classList.add("active");

  setTimeout(() => {
    chemicals[chemicalId].classList.remove("active", "highlight");
    chemicals[chemicalId].classList.add("used");

    switch (chemicalId) {
      case "bead":
        const magBeadObj = document.getElementById("magBeadObj");

        const bxStart = 220;
        const byStart = 500; // move down (bottom)

        // 🔵 End: Center of white flask near scale
        const bxEnd = 450; // move left
        const byEnd = 250; // move up

        magBeadObj.style.setProperty("--bx-start", `${bxStart}px`);
        magBeadObj.style.setProperty("--by-start", `${byStart}px`);
        magBeadObj.style.setProperty("--bx-end", `${bxEnd}px`);
        magBeadObj.style.setProperty("--by-end", `${byEnd}px`);

        magBeadObj.style.opacity = "1";
        magBeadObj.style.animation = "beadUpRight 1.2s ease-out forwards";

        setTimeout(() => {
          magBeadObj.style.opacity = "0";
          magBeadObj.style.animation = "none";
          magBeadObj.style.transform = "none";

          showFlaskImage(3);
          addObservation("Magnetic bead added to flask");

          canProceed = true;
          nextBtn.disabled = false;
          nextBtn.classList.add("glow-next");
        }, 1300);
        break;

      // Show weighing animation
      case "phthalic":
        const doseImg = document.getElementById("phthalicDose");
        const bottleRect = chemicals.phthalic.getBoundingClientRect();
        const scaleRect = scale.getBoundingClientRect();

        // Starting position (bottle center)
        doseImg.style.setProperty("--x-start", `${-190}px`);
        doseImg.style.setProperty("--y-start", `${80}px`);

        // Middle (scale plate location)
        doseImg.style.setProperty("--x-mid", `${-420}px`);
        doseImg.style.setProperty("--y-mid", `-55px`);

        // Final right move
        doseImg.style.setProperty("--x-end", `-265px`);
        doseImg.style.setProperty("--y-end", `-160px`);

        // Show image & start first animation
        doseImg.style.opacity = "1";
        doseImg.style.animation = "moveToScale 1.2s ease-out forwards";

        // After movement done → start weighing
        setTimeout(() => {
          document.querySelector(".scale").classList.add("active");
          animateWeight(0.5);

          // After weighing done → slide right
          setTimeout(() => {
            doseImg.style.animation = "moveRight 2.2s ease-out forwards";

            setTimeout(() => {
              // Hide dose image completely after animation
              doseImg.style.opacity = "0";
              doseImg.style.animation = "none"; // reset animation state
              doseImg.style.transform = "none"; // reset position
              updateConicalFlask(2);

              // updateFlask('#f5f5dc', 15);
              addObservation("0.5g Phthalic Anhydride weighed and added");

              canProceed = true;
              nextBtn.disabled = false;
              nextBtn.classList.add("glow-next");
            }, 1000);
          }, 2000); // matching scale/weight animation
        }, 1400);

        break;

      case "resorcinol":
        const resImg = document.getElementById("resorcinolDose");
        const bottleRectR = chemicals.resorcinol.getBoundingClientRect();
        const scaleRectR = scale.getBoundingClientRect();

        // Starting position (5px more right than phthalic)
        resImg.style.setProperty("--x-start", `${-160}px`);
        resImg.style.setProperty("--y-start", `${80}px`);

        // Middle → scale plate
        resImg.style.setProperty("--x-mid", `${-420}px`);
        resImg.style.setProperty("--y-mid", `-55px`);

        // Final move right
        resImg.style.setProperty("--x-end", `-295px`);
        resImg.style.setProperty("--y-end", `-100px`);

        // Phase-1 → Move to scale
        resImg.style.opacity = "1";
        resImg.style.animation = "moveToScale 1.4s ease-out forwards";

        // Phase-2 → Start weighing when image arrives
        setTimeout(() => {
          document.querySelector(".scale").classList.add("active");
          animateWeight(0.75);

          // Phase-3 → Move to right after weighing
          setTimeout(() => {
            resImg.style.animation = "moveRight 1s ease-out forwards";

            setTimeout(() => {
              // Hide image completely after animation
              resImg.style.opacity = "0";
              resImg.style.animation = "none";
              resImg.style.transform = "none";
              updateConicalFlask(3);

              // updateFlask('#ffe4d4', 30);
              addObservation("0.75g Resorcinol weighed and added");

              canProceed = true;
              nextBtn.disabled = false;
              nextBtn.classList.add("glow-next");
            }, 1000);
          }, 2000);
        }, 1400);
        break;

      case "h2so4":
        updateConicalFlask(4);
        const acidObj = document.getElementById("acidObject");
        const acidObj2 = document.getElementById("acidObject2"); // new image

        const acidBottle = chemicals.h2so4;
        const bottleRectA = acidBottle.getBoundingClientRect();
        const labRect = document
          .querySelector(".lab-table")
          .getBoundingClientRect();

        // Step-1 start → bottle location
        const startX = bottleRectA.left - labRect.left + 5;
        const startY = bottleRectA.top - labRect.top + 40;

        // Step-1 end → Up + Left (into flask)
        const midX = startX - 250;
        const midY = startY - 305;

        // Apply step-1 animation variables
        acidObj.style.setProperty("--x-start", `${startX}px`);
        acidObj.style.setProperty("--y-start", `${startY}px`);
        acidObj.style.setProperty("--x-end", `${midX}px`);
        acidObj.style.setProperty("--y-end", `${midY}px`);

        acidObj.style.opacity = "1";
        acidObj.style.animation = "acidUpLeft 1s ease-out forwards";

        // Step-2 → move right with NEW image
        setTimeout(() => {
          acidObj.style.opacity = "0"; // hide old drop
          acidObj.style.animation = "none";

          // Step-2 → appear from mid position
          const endX2 = midX + 200; // move right
          const endY2 = midY + 60; // slightly down

          acidObj2.style.setProperty("--x2-start", `${midX}px`);
          acidObj2.style.setProperty("--y2-start", `${midY}px`);
          acidObj2.style.setProperty("--x2-end", `${endX2}px`);
          acidObj2.style.setProperty("--y2-end", `${endY2}px`);

          acidObj2.style.opacity = "1";
          acidObj2.style.animation = "acidRight 1.5s ease forwards";

          setTimeout(() => {
            acidObj2.style.opacity = "0";
            acidObj2.style.animation = "none";
            acidObj2.style.transform = "none";
            updateConicalFlask(4);

            addObservation("Conc. H₂SO₄ added (movable drop)");

            canProceed = true;
            nextBtn.disabled = false;
            nextBtn.classList.add("glow-next");
          }, 1500);
        }, 1600);
        break;

      case "water":
        const waterObj = document.getElementById("waterObject");
        const waterBottle = chemicals.water;

        const bottleRectW = waterBottle.getBoundingClientRect();
        const labRectW = document
          .querySelector(".lab-table")
          .getBoundingClientRect();

        // Start point (15px left like you wanted)
        const wxStart = bottleRectW.left - labRectW.left - 10;
        const wyStart = bottleRectW.top - labRectW.top + 35;

        // End point (Up + Left)
        const wxEnd = wxStart + 210;
        const wyEnd = wyStart - 200;

        // Apply CSS animation variables
        waterObj.style.setProperty("--wx-start", `${wxStart}px`);
        waterObj.style.setProperty("--wy-start", `${wyStart}px`);
        waterObj.style.setProperty("--wx-end", `${wxEnd}px`);
        waterObj.style.setProperty("--wy-end", `${wyEnd}px`);

        waterObj.style.opacity = "1";
        waterObj.style.animation = "waterUpLeft 1.2s ease-out forwards";

        setTimeout(() => {
          waterObj.style.opacity = "0";
          waterObj.style.animation = "none";
          waterObj.style.transform = "none";
          document.getElementById("brownImg").src = "new fold/redgreen.png";
          document.getElementById("brownLabel").textContent = "Red Liquid";
          document.getElementById("brownImg").classList.add("glow-green");

          // 🔴 removed updateFlask(...)
          addObservation("Distilled water added - product dissolving");

          canProceed = true;
          nextBtn.disabled = false;
          nextBtn.classList.add("glow-next");
        }, 1300);
        break;

      case "ammonia":
        const ammObj = document.getElementById("ammoniaObject");
        const ammBottle = chemicals.ammonia;

        const bottleRectAM = ammBottle.getBoundingClientRect();
        const labRectAM = document
          .querySelector(".lab-table")
          .getBoundingClientRect();

        // Start: 20px more left from bottle position
        const axStart = bottleRectAM.left - labRectAM.left + 5;
        const ayStart = bottleRectAM.top - labRectAM.top + 30;

        // Move LEFT + Upward ( \ direction )
        const axEnd = axStart + 110;
        const ayEnd = ayStart - 190;

        ammObj.style.setProperty("--ax-start", `${axStart}px`);
        ammObj.style.setProperty("--ay-start", `${ayStart}px`);
        ammObj.style.setProperty("--ax-end", `${axEnd}px`);
        ammObj.style.setProperty("--ay-end", `${ayEnd}px`);

        ammObj.style.opacity = "1";
        ammObj.style.animation = "ammoniaFly 1.25s ease-out forwards";

        setTimeout(() => {
          ammObj.style.opacity = "0";
          ammObj.style.animation = "none";
          ammObj.style.transform = "none";
          document.getElementById("brownImg").src = "new fold/brown beaker.png";
          document.getElementById("brownLabel").textContent = "Green Liquid";
          document.getElementById("brownImg").classList.remove("glow-green");

          addObservation("Ammonia added - solution becoming basic");
          canProceed = true;
          nextBtn.disabled = false;
          nextBtn.classList.add("glow-next");
        }, 1250);

        break;

      case "waterPour":
        const slideImg = document.getElementById("pourSlideImg");
        const diagImg = document.getElementById("transitionDiagonalImg");
        const brownImg = document.getElementById("brownImg");

        const bRect = brownImg.getBoundingClientRect();
        const labRecti = document
          .querySelector(".lab-table")
          .getBoundingClientRect();

        // Bottom-left of brown beaker
        const startXi = bRect.left - labRecti.left + 5;
        const startYi = bRect.bottom - labRecti.top + 30;

        // Slide →
        slideImg.style.setProperty("--sr-start-x", `${startXi}px`);
        slideImg.style.setProperty("--sr-start-y", `${startYi - 110}px`);
        slideImg.style.setProperty("--sr-end-x", `${startXi + 165}px`);
        slideImg.style.setProperty("--sr-end-y", `${startYi - 170}px`);

        // Diagonal ↗
        diagImg.style.setProperty("--dg-start-x", `${startXi + 20}px`);
        diagImg.style.setProperty("--dg-start-y", `${startYi}px`);
        diagImg.style.setProperty("--dg-end-x", `${startXi + 170}px`);
        diagImg.style.setProperty("--dg-end-y", `${startYi - 170}px`);

        // Make visible before animation
        slideImg.classList.remove("hidden");
        slideImg.style.opacity = "1";

        diagImg.classList.remove("hidden");
        diagImg.style.opacity = "0"; // visible only when second animation starts

        // ▶ Slide animation
        slideImg.style.animation = "slideRighti 1.2s ease-out forwards";

        setTimeout(() => {
          slideImg.classList.add("hidden");
          slideImg.style.animation = "none";

          // ▶ Diagonal animation
          diagImg.style.opacity = "1";
          diagImg.style.animation = "moveDiagonali 1.2s ease-out forwards";

          setTimeout(() => {
            diagImg.classList.add("hidden");
            diagImg.style.animation = "none";

            document.getElementById("greenYellowImg").src =
              "new fold/fluroshine.png";
            document.getElementById("brownLabel").textContent =
              "Yellow-Green Liquid";

            addObservation("Dilution formed yellow-green fluorescein");

            canProceed = true;
            nextBtn.disabled = false;
            nextBtn.classList.add("glow-next");
          }, 1200);
        }, 1200);
        break;

      case "columnChromo":
        const dropper = document.getElementById("dropper");

        // Reset animation first
        dropper.style.animation = "none";
        dropper.offsetHeight; // force reflow to restart animation
        dropper.style.animation = "";

        // Make dropper visible & animated
        dropper.classList.add("visible-dropper");

        addObservation(
          "Column chromatography performed — Dark red pure solid fluorescein obtained"
        );

        // document.getElementById("greenYellowImg").classList.remove("glow-on");
        // document
        //   .querySelector(".greenYellow-item")
        //   .classList.remove("uv-background");
        // mainFlask.classList.remove("glowing");

        canProceed = true;
        nextBtn.disabled = false;
        nextBtn.classList.add("glow-next");
        break;
    }
  }, 500);
}

// Animate weight display
function animateWeight(targetWeight) {
  let weight = 0;
  const increment = targetWeight / 20;
  const interval = setInterval(() => {
    weight += increment;
    if (weight >= targetWeight) {
      weight = targetWeight;
      clearInterval(interval);
    }
    scaleDisplay.textContent = `${weight.toFixed(2)} g`;
  }, 100);
}

// Handle heating
function handleHeat() {
  if (STEPS[currentStep].action !== "heat") return;

  const heatObj = document.getElementById("heatAnim");
  const heatingSetup = document.getElementById("heatingSetup");

  const setupRect = heatingSetup.getBoundingClientRect();
  const labRect = document.querySelector(".lab-table").getBoundingClientRect();

  // 🔹 Starting position (center of flask)
  const hxStart = setupRect.left - labRect.left + 95;
  const hyStart = setupRect.top - labRect.top + 200;

  // 🔹 Move horizontally right
  const hxEnd = hxStart + 300;
  const hyEnd = hyStart; // no vertical movement

  heatObj.style.setProperty("--hx-start", `${hxStart}px`);
  heatObj.style.setProperty("--hy-start", `${hyStart}px`);
  heatObj.style.setProperty("--hx-end", `${hxEnd}px`);
  heatObj.style.setProperty("--hy-end", `${hyEnd}px`);
  removeFlaskHighlight();
  showFlaskImage(2);
  heatObj.style.opacity = "1";

  heatObj.style.animation = "heatMoveRight 1.8s ease-out forwards";

  setTimeout(() => {
    heatObj.style.opacity = "0";
    heatObj.style.animation = "none";
    heatObj.style.transform = "none";

    addObservation("Mixture heated — motion observed");

    canProceed = true;
    nextBtn.disabled = false;
    actionHint.classList.remove("visible");

    showFlaskImage(1);
  }, 2000);
}

// Perform observation
function performObserve() {
  const gyDiv = document.querySelector(".greenYellow-item");
  const gyImg = document.getElementById("greenYellowImg");

  gyImg.src = "new fold/fluroshine.png";
  gyImg.classList.add("glow-on");

  // UV neon ON for this div only
  gyDiv.classList.add("uv-on");

  addObservation("Bright green fluorescence observed under UV light!");
}

// Reset experiment

function resetExperiment() {
  resetBtn.addEventListener("click", () => {
    location.reload();
  });
}

// Next step
function nextStep() {
  if (currentStep === STEPS.length - 1) {
    location.reload();
    return;
  }

  if (!canProceed && currentStep !== 0) return;

  currentStep++;
  updateUI();
}

// Toggle voice
function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  voiceBtn.classList.toggle("muted", !voiceEnabled);
  voiceBtn.textContent = voiceEnabled ? "🔊" : "🔇";

  if (!voiceEnabled) {
    window.speechSynthesis.cancel();
  }
}

// Event listeners
nextBtn.addEventListener("click", nextStep);
resetBtn.addEventListener("click", resetExperiment);
voiceBtn.addEventListener("click", toggleVoice);

// Chemical bottle clicks
Object.entries(chemicals).forEach(([id, element]) => {
  element.addEventListener("click", () => handleChemicalClick(id));
});

// Hide all flask stages
function showFlaskImage(stage) {
  document
    .querySelectorAll(".flask-stage")
    .forEach((img) => img.classList.add("hidden"));
  document.getElementById("flaskImg" + stage).classList.remove("hidden");
}

// Highlight clickable flask (backlight pulse)
function highlightFlaskClick() {
  const flask = document.getElementById("heatingSetup");
  flask.classList.add("clickable-highlight");

  // Allow clicking the flask only in Step 5
  flask.addEventListener("click", handleHeat, { once: true });
}

// document.getElementById("flaskImg1").addEventListener("click", handleHeat);
document.getElementById("flaskImg2").addEventListener("click", handleHeat);
// document.getElementById("flaskImg3").addEventListener("click", handleHeat);
function removeFlaskHighlight() {
  const flask = document.getElementById("heatingSetup");
  flask.classList.remove("clickable-highlight");
}

function updateConicalFlask(stage) {
  const conicalImgs = document.querySelectorAll(".extra-img");

  conicalImgs.forEach((img) => img.classList.add("hidden"));
  document.getElementById("extraImg" + stage).classList.remove("hidden");
}

// Initialize voices (needed for some browsers)
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

// Initial UI update
updateUI();
