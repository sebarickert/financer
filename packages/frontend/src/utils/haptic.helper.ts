export type HapticType = 'none' | 'ultra-light' | 'light' | 'medium' | 'heavy';

export const hapticRunner = (type: HapticType): void => {
  if (type === 'none') return;

  if (window.navigator.vibrate) {
    switch (type) {
      case 'ultra-light':
        window.navigator.vibrate(1);
        break;
      case 'light':
        window.navigator.vibrate(5);
        break;
      case 'medium':
        window.navigator.vibrate(15);
        break;
      case 'heavy':
        window.navigator.vibrate(30);
        break;
    }
  }
};
