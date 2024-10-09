export type TransitionType = keyof typeof transitionAnimations;

const defaultKeyframeAnimationOptions: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease',
  fill: 'forwards',
};

const slideInFromLeft = () => {
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

// new slideInFromBottom  and zoom old out
const slideInFromBottom = () => {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translate(0, 0)',
      },
      {
        opacity: 1,
        transform: 'translate(0, -100%)',
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
        transform: 'translate(0, 100%)',
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
  slideInFromBottom,
};