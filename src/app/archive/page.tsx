
import { redirect } from 'next/navigation';

export default function ArchiveRedirectPage() {
  redirect('/edicion-2025');

  // This part will not be rendered due to the redirect.
  // It's good practice to return null or a loading component.
  return null;
}
