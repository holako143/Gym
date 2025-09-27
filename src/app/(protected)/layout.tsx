import Layout from '../../components/Layout';

export default function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}