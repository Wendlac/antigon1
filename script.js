document.addEventListener('DOMContentLoaded', () => {
    const missionList = document.getElementById('missionList');
    const searchInput = document.querySelector('#searchBar input');
    const profileFilter = document.getElementById('profileFilter');
    const budgetRange = document.getElementById('budgetRange');
    const budgetMax = document.getElementById('budgetMax');
    const locationFilter = document.getElementById('locationFilter');    
    
    // Exemple de données de mission
    const missions = [
        { title: "Illustrateur 2D", company: "DIACFA", budget: 5000, keywords: ["design", "illustration"], date: "2024-08-30", location: "paris", profile: "design" },
        { title: "Photographe produit", company: "Maison du meuble", budget: 6000, keywords: ["photo", "événement"], date: "2024-08-29", location: "Bobo Dioulasso", profile: "photo" },
        { title: "Photographe institutionnel", company: "EventPro", budget: 7000, keywords: ["photo", "produit"], date: "2024-08-29", location: "Ouagadougou", profile: "photo" },
        { title: "Photographe événementiel", company: "EventPro", budget: 3000, keywords: ["photo", "événement"], date: "2024-08-29", location: "Paris", profile: "photo" },
        { title: "Photographe événementiel", company: "Focus Group", budget: 10000, keywords: ["photo", "événement"], date: "2024-08-29", location: "marseille", profile: "photo" },
        { title: "Developeur web", company: "Moov Africa", budget: 5000, keywords: ["frontend", "mysql"], date: "2024-08-30", location: "Seattle", profile: "design" },
        { title: "Designer UX", company: "TechCorp", budget: 5000, keywords: ["design", "mobile"], date: "2024-08-30", location: "Paris", profile: "design" },
        { title: "Designer UI/UX", company: "Orange", budget: 5000, keywords: ["design", "mobile"], date: "2024-08-31", location: "Koudougou", profile: "design" },
        { title: "Graphic Design", company: "CFAO", budget: 3000, keywords: ["brand", "mecanique"], date: "2024-07-29", location: "Ouagadougou", profile: "photo" },

        // Ajoute d'autres missions ici
    ];


 
    // Fonction pour afficher les missions
    function displayMissions(missions) {
        missionList.innerHTML = '';
        missions.forEach(mission => {
            const missionElement = document.createElement('div');
            missionElement.classList.add('mission');
            missionElement.innerHTML = `
                <h3>${mission.title}</h3>
                <p><strong>Entreprise:</strong> ${mission.company}</p>
                <p><strong>Budget:</strong> <span class="budget">${mission.budget}€</span></p>
                <p><strong>Date:</strong> <span class="date">${mission.date}</span></p>
                <div class="keywords">
                    ${mission.keywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
                </div>
                <div class="mission-buttons">
                    <button class="apply-button">Postuler</button>
                    <button class="details-button">Voir les détails</button>
                </div>
            `;
            missionList.appendChild(missionElement);
        });
    }

    // Fonction pour filtrer les missions
    async function filterMissions() {
        const searchTerm = searchInput.value;
        const selectedProfile = profileFilter.value;
        const maxBudget = budgetRange.value;
        const selectedLocation = locationFilter.value;

        let searchParams = new URLSearchParams();
        if (searchTerm) searchParams.append('keyword', searchTerm);
        if (selectedProfile) searchParams.append('skills', selectedProfile);
        if (maxBudget) searchParams.append('maxBudget', maxBudget);
        if (selectedLocation) searchParams.append('location', selectedLocation);

        const missions = await fetchMissions(`?${searchParams.toString()}`);
        displayMissions(missions);
    }
// Afficher les missions initiales
displayMissions(missions);

    // Initialisation
    filterMissions();

    // Mise à jour de l'affichage du budget max
    budgetRange.addEventListener('input', function() {
        budgetMax.textContent = this.value + '€';
        filterMissions();
    });

    // Écouteurs d'événements pour les filtres
    searchInput.addEventListener('input', filterMissions);
    profileFilter.addEventListener('change', filterMissions);
    locationFilter.addEventListener('change', filterMissions);

    // Initialisation de l'affichage du budget
    budgetMax.textContent = budgetRange.value + '€';
});