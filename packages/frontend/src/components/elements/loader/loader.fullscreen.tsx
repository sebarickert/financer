import { Loader } from './loader';

export const LoaderFullScreen = (): JSX.Element => (
  <div className="fixed inset-0 z-50 flex items-center w-full h-full">
    <div className="fixed inset-0 transition-opacity">
      <div className="absolute inset-0 opacity-80 bg-white" />
    </div>
    <div className="w-full flex items-center justify-center">
      <Loader.Icon />
    </div>
  </div>
);
