import { Loader } from '$elements/Loader';
import { Layout } from '$layouts/Layout';

export default function Loading() {
  return (
    <Layout title="Market Update Settings" isLoading>
      <Loader />
    </Layout>
  );
}
