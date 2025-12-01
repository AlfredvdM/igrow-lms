import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function RootPage() {
  const { userId } = await auth();

  if (userId) {
    // User is authenticated, redirect to insights
    redirect('/insights');
  } else {
    // User is not authenticated, redirect to sign-in
    redirect('/sign-in');
  }
}
