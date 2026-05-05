
import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { getNomineeByIdAction } from '@/app/actions';

type Props = {
  params: Promise<{ nomineeId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { nomineeId } = await params;
  const nominee = await getNomineeByIdAction(nomineeId);

  if (!nominee) {
    return {
      title: 'Nominado no encontrado | Latin American Leaders Awards',
    };
  }

  const title = `Vota por ${nominee.name} | Latin American Leaders Awards 2026`;
  const description = `Apoya a ${nominee.name} en los Latin American Leaders Awards 2026. ${nominee.bio.substring(0, 160)}...`;
  const imageUrl = nominee.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2FLatin-American-Leaders-Awards-1.webp?alt=media';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
      type: 'profile',
      url: `https://awards.pro-latam.org/${nomineeId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function NomineeRedirectPage({ params }: Props) {
  const { nomineeId } = await params;

  if (!nomineeId) {
    redirect('/');
  }

  // Optional: Check if the nominee exists before redirecting.
  // This prevents broken share links if a nominee is removed.
  const nomineeExists = await getNomineeByIdAction(nomineeId);
  
  if (!nomineeExists) {
     // Redirect to a 'not found' page or the homepage if the nominee doesn't exist.
     redirect('/vota');
  }

  // Redirect to the official 2026 profile page
  redirect(`/nominados/${nomineeId}`);

  // This part will not be rendered due to the redirect.
  // It's good practice to return null or a loading component.
  return null;
}
