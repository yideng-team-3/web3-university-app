import Header from '@components/common/Header';
import { Toaster } from 'react-hot-toast';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-white dark:bg-stone-800 transition-colors duration-200 ease-in'>
      <Toaster position="top-center" />
      <Header />
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
}
