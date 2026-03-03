import confetti from "canvas-confetti";

export const useConfetti = () => {
  const fireConfetti = () => {
    // Primeira rajada — esquerda
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
    });

    // Segunda rajada — direita
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.8 },
    });

    // Terceira rajada — centro
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
      });
    }, 300);
  };

  return { fireConfetti };
};
