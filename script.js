document.addEventListener('DOMContentLoaded', () => {
    const missionList = document.getElementById('missionList');
    const searchInput = document.querySelector('#searchBar input');
    const profileFilter = document.getElementById('profileFilter');
    const budgetRange = document.getElementById('budgetRange');
    const budgetMax = document.getElementById('budgetMax');
    const locationFilter = document.getElementById('locationFilter');

    // Fonction pour récupérer les missions depuis l'API
    async function fetchMissions(searchParams = '') {
        try {
            const response = await fetch(`http://localhost:3000/api/missions/search${searchParams}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des missions');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    }

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
                <p><strong>Date:</strong> <span class="date">${new Date(mission.deadline).toLocaleDateString()}</span></p>
                <p><strong>Localisation:</strong> ${mission.location || 'Non spécifié'}</p>
                <div class="keywords">
                    ${mission.skills.map(skill => `<span class="keyword">${skill}</span>`).join('')}
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