
import { adminDb } from '@/lib/firebase-admin';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default async function DebugDbPage() {
  let stats: any[] = [];
  let error = null;

  try {
    const collections = ['nominees', 'nominationRequests', 'votes', 'partners', 'registrations'];
    
    for (const collName of collections) {
      const snap = await adminDb.collection(collName).get();
      const count = snap.size;
      
      // Get counts by edition and category
      const editions: Record<string, number> = {};
      const categoriesFound: Record<string, number> = {};
      snap.forEach(doc => {
        const data = doc.data();
        const ed = data.edition || 'undefined';
        editions[ed] = (editions[ed] || 0) + 1;
        
        const cat = data.category || 'no-category';
        categoriesFound[cat] = (categoriesFound[cat] || 0) + 1;
      });
      
      stats.push({
        name: collName,
        total: count,
        editions,
        categoriesFound
      });
    }
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background p-8">
      <Header />
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Base de Datos Stats (Admin SDK)</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded mb-8 text-red-200">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map(s => (
            <div key={s.name} className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4 capitalize">{s.name}</h2>
              <p className="text-3xl font-bold mb-4">{s.total} documentos</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Por edición:</p>
                {Object.entries(s.editions).map(([ed, count]) => (
                  <div key={ed} className="flex justify-between text-sm">
                    <span>Edición {ed}:</span>
                    <span className="font-mono">{count}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                <p className="text-sm text-gray-400">Por categoría (Top 10):</p>
                {Object.entries(s.categoriesFound).slice(0, 10).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between text-xs">
                    <span className="truncate mr-2" title={cat}>{cat}:</span>
                    <span className="font-mono">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-4 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="text-sm">
                Nota: Estos datos se obtienen directamente usando Firebase Admin SDK. 
                Si ves números aquí pero la web no muestra nada, el problema está en el filtrado del lado del cliente o en la conexión del SDK cliente.
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
