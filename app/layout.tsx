import '../styles/globals.css';
import SupabaseProvider from './providers/SupabaseProvider';

export const metadata = {
  title: 'Service Connect',
  description: 'Connect with and buy services from providers near you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-gray-100' suppressHydrationWarning={true}>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  )
}
