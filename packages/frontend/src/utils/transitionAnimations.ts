export type TransitionType = keyof typeof transitionAnimations;

const defaultKeyframeAnimationOptions: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease',
  fill: 'forwards',
};

const isDesktop = () => {
  return window.matchMedia('(min-width: 1024px)').matches ?? false;
};

const slideInFromLeft = () => {
  if (isDesktop()) return;

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translate(0, 0)',
      },
      {
        opacity: 1,
        transform: 'translate(100%, 0)',
      },
    ],
    {
      ...defaultKeyframeAnimationOptions,
      pseudoElement: '::view-transition-old(root)',
    },
  );

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translate(-100%, 0)',
      },
      {
        opacity: 1,
        transform: 'translate(0, 0)',
      },
    ],
    {
      ...defaultKeyframeAnimationOptions,
      pseudoElement: '::view-transition-new(root)',
    },
  );
};

const slideInFromRight = () => {
  if (isDesktop()) return;

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translate(0, 0)',
      },
      {
        opacity: 1,
        transform: 'translate(-100%, 0)',
      },
    ],
    {
      ...defaultKeyframeAnimationOptions,
      pseudoElement: '::view-transition-old(root)',
    },
  );

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translate(100%, 0)',
      },
      {
        opacity: 1,
        transform: 'translate(0, 0)',
      },
    ],
    {
      ...defaultKeyframeAnimationOptions,
      pseudoElement: '::view-transition-new(root)',
    },
  );
};

export const transitionAnimations = {
  slideInFromLeft,
  slideInFromRight,
};
