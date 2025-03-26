import { Button } from '@/elements/Button/Button';
import { ContentHeader } from '@/layouts/ContentHeader';

export default function NotFound() {
  return (
    <>
      <ContentHeader title="404 - Not Found" />
      <p className="max-w-xl mb-4 text-lg ">
        Oops! The page you&apos;re looking for doesn&apos;t exist. It may have
        been moved or deleted.
      </p>
      <div className="flex items-center gap-2">
        <Button href="/">Return to homepage</Button>
      </div>
    </>
  );
}
