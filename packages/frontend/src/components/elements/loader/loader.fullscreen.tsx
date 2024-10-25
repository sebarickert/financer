import { Loader } from './loader';

export const LoaderFullScreen = (): JSX.Element => (
  <div className="fixed inset-0 z-50 flex items-center w-full h-full">
    <div className="fixed inset-0 transition-opacity">
      <div className="absolute inset-0 opacity-80 theme-bg-color" />
    </div>
    <div className="flex items-center justify-center w-full">
      <Loader.Icon />
    </div>
  </div>
);
