import clsx from 'clsx';

interface HomePageProps {
  className?: string;
}

const HomePage = ({ className = '' }: HomePageProps) => {
  return <div className={clsx('', { [className]: true })}>HomePage</div>;
};

export default HomePage;
