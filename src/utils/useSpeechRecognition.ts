export function speak(text: string) {
  if ("speechSynthesis" in window) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }
}
