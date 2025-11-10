export default function ParentDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-primary-700">
          Tableau de bord Parent
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <h2 className="mb-4 text-2xl font-bold">Progression</h2>
            <p className="text-gray-700">Vue d'ensemble de la progression de tous les profils.</p>
          </div>
          <div className="card">
            <h2 className="mb-4 text-2xl font-bold">Statistiques</h2>
            <p className="text-gray-700">Erreurs fréquentes, compétences à travailler, temps passé...</p>
          </div>
          <div className="card">
            <h2 className="mb-4 text-2xl font-bold">Export / Import</h2>
            <p className="text-gray-700">Sauvegarde et restauration des données.</p>
          </div>
          <div className="card">
            <h2 className="mb-4 text-2xl font-bold">Paramètres</h2>
            <p className="text-gray-700">Configuration de l'application.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
