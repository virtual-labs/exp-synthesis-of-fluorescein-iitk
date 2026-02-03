// Text-to-Speech main function
function speak(text) {
    let utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
}

// ✔ Allow speech after first mouse movement
function enableSpeechOnce() {
    const inst = document.getElementById("text").innerText;
    speak(inst);
    document.removeEventListener("mousemove", enableSpeechOnce);
}

// Wait for first mouse movement → then speak instructions
document.addEventListener("mousemove", enableSpeechOnce);

// ✔ Speak next instruction when Start button is clicked
document.getElementById("start").addEventListener("click", () => {
    speak("Experiment is starting.");
});
