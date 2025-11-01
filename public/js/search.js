// Search functionality
class MatchSearch {
    constructor() {
        this.allMatches = [];
        this.searchResults = [];
        this.init();
    }
    
    async init() {
        // Load all matches for search
        await this.loadMatches();
        
        // Setup desktop search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            this.setupSearchInput(searchInput, 'search-results');
        }
        
        // Setup mobile search input
        const searchInputMobile = document.getElementById('search-input-mobile');
        if (searchInputMobile) {
            this.setupSearchInput(searchInputMobile, 'search-results-mobile');
        }
        
        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });
    }
    
    setupSearchInput(input, resultsId) {
        // Debounce search
        let searchTimeout;
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value, resultsId);
            }, 300);
        });
        
        // Show results on focus
        input.addEventListener('focus', () => {
            if (input.value.trim()) {
                this.performSearch(input.value, resultsId);
            }
        });
    }
    
    async loadMatches() {
        try {
            this.allMatches = await API.getAllMatches();
        } catch (error) {
            console.error('Error loading matches for search:', error);
            this.allMatches = [];
        }
    }
    
    performSearch(query, resultsId = 'search-results') {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (!trimmedQuery) {
            this.hideResults(resultsId);
            return;
        }
        
        // Search through matches
        this.searchResults = this.allMatches.filter(match => {
            const homeTeam = (match.homeTeam || '').toLowerCase();
            const awayTeam = (match.awayTeam || '').toLowerCase();
            const sport = (match.sport || '').toLowerCase();
            const title = `${match.homeTeam} vs ${match.awayTeam}`.toLowerCase();
            
            return homeTeam.includes(trimmedQuery) ||
                   awayTeam.includes(trimmedQuery) ||
                   sport.includes(trimmedQuery) ||
                   title.includes(trimmedQuery);
        }).slice(0, 10); // Limit to 10 results
        
        this.displayResults(resultsId);
    }
    
    displayResults(resultsId = 'search-results') {
        const resultsContainer = document.getElementById(resultsId);
        if (!resultsContainer) return;
        
        if (this.searchResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="p-4 text-center text-gray-400">
                    No matches found
                </div>
            `;
            resultsContainer.classList.remove('hidden');
            return;
        }
        
        resultsContainer.innerHTML = this.searchResults.map(match => {
            const homeBadge = match.homeBadge ? API.getBadgeUrl(match.homeBadge) : '';
            const awayBadge = match.awayBadge ? API.getBadgeUrl(match.awayBadge) : '';
            
            return `
                <a href="watch.html?id=${match.id}" class="block p-3 hover:bg-slate-700 rounded-lg transition-colors">
                    <div class="flex items-center space-x-3">
                        ${homeBadge ? `<img src="${homeBadge}" alt="${match.homeTeam}" class="w-8 h-8 object-contain">` : ''}
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-white truncate">
                                ${match.homeTeam}${match.awayTeam ? ' vs ' + match.awayTeam : ''}
                            </div>
                            <div class="text-xs text-gray-400">
                                ${match.sport} • ${match.time}
                            </div>
                        </div>
                        ${match.isLive ? '<span class="px-2 py-1 text-xs bg-red-500 text-white rounded">LIVE</span>' : ''}
                    </div>
                </a>
            `;
        }).join('');
        
        resultsContainer.classList.remove('hidden');
    }
    
    hideResults(resultsId = null) {
        const resultsContainers = resultsId 
            ? [document.getElementById(resultsId)]
            : [
                document.getElementById('search-results'),
                document.getElementById('search-results-mobile')
            ].filter(Boolean);
        
        resultsContainers.forEach(container => {
            if (container) {
                container.classList.add('hidden');
            }
        });
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MatchSearch();
    });
} else {
    new MatchSearch();
}
