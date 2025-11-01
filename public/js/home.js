// Load homepage content
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🏠 Loading homepage...');
    
    // Load sports grid
    loadSportsGrid();
    
    // Load matches
    await loadMatches();
});

// Load sports categories grid
function loadSportsGrid() {
    const grid = document.getElementById('sports-grid');
    if (!grid) return;
    
    grid.innerHTML = SPORTS.map(sport => `
        <a href="${sport.page}" class="group block">
            <div class="flex flex-col items-center space-y-3 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all duration-300 hover:scale-105 h-full">
                <div class="${sport.color} w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="text-3xl">${sport.emoji}</span>
                </div>
                <div class="text-center">
                    <span class="text-sm font-semibold text-gray-300 group-hover:text-white block mb-1">
                        ${sport.name}
                    </span>
                    <span class="text-xs text-gray-500 line-clamp-2">
                        ${sport.leagues}
                    </span>
                </div>
            </div>
        </a>
    `).join('');
}

// Load live and upcoming matches
async function loadMatches() {
    try {
        // Fetch live and today's matches
        const [liveMatches, todayMatches] = await Promise.all([
            API.getLiveMatches(),
            API.getTodayMatches()
        ]);
        
        // Filter matches with badges
        const liveWithBadges = liveMatches.filter(m => 
            m.homeBadge && m.awayBadge && m.awayTeam
        ).slice(0, 6);
        
        const upcomingWithBadges = todayMatches.filter(m => 
            !m.isLive && m.homeBadge && m.awayBadge && m.awayTeam
        ).slice(0, 6);
        
        // Update stats
        const totalViewers = Math.floor(Math.random() * 100000) + 50000;
        document.getElementById('live-count').textContent = `${liveWithBadges.length} Live Matches`;
        document.getElementById('viewer-count').textContent = `${totalViewers.toLocaleString()}+ Viewers`;
        
        // Display live matches
        if (liveWithBadges.length > 0) {
            document.getElementById('live-matches-section').style.display = 'block';
            document.getElementById('live-matches').innerHTML = liveWithBadges.map(createMatchCard).join('');
        }
        
        // Display upcoming matches
        if (upcomingWithBadges.length > 0) {
            document.getElementById('upcoming-matches-section').style.display = 'block';
            document.getElementById('upcoming-matches').innerHTML = upcomingWithBadges.map(createMatchCard).join('');
        }
        
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

// Create match card HTML
function createMatchCard(match) {
    const watchUrl = `watch.html?id=${encodeURIComponent(match.id)}`;
    
    return `
        <a href="${watchUrl}" class="group">
            <div class="bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-300 hover:scale-105">
                <!-- Header -->
                <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-2 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-400 uppercase tracking-wide">${match.sport}</span>
                        <span class="text-xs text-gray-500">•</span>
                        <span class="text-xs text-gray-400">${match.league}</span>
                    </div>
                    ${match.isLive ? `
                        <div class="flex items-center space-x-1 bg-red-500 px-2 py-0.5 rounded-full">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span class="text-xs font-bold text-white">LIVE</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Teams -->
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <!-- Home Team -->
                        <div class="flex-1 text-center">
                            ${match.homeBadge ? `
                                <img src="${API.getBadgeUrl(match.homeBadge)}" 
                                     alt="${match.homeTeam}" 
                                     class="w-16 h-16 object-contain mx-auto mb-2"
                                     onerror="this.style.display='none'">
                            ` : ''}
                            <h3 class="text-sm font-semibold text-white">${match.homeTeam}</h3>
                        </div>
                        
                        <!-- VS -->
                        <div class="px-4">
                            <span class="text-2xl font-bold text-gray-500">VS</span>
                        </div>
                        
                        <!-- Away Team -->
                        <div class="flex-1 text-center">
                            ${match.awayBadge ? `
                                <img src="${API.getBadgeUrl(match.awayBadge)}" 
                                     alt="${match.awayTeam}" 
                                     class="w-16 h-16 object-contain mx-auto mb-2"
                                     onerror="this.style.display='none'">
                            ` : ''}
                            <h3 class="text-sm font-semibold text-white">${match.awayTeam}</h3>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div class="flex items-center space-x-2 text-sm text-gray-400">
                            <span>⏰</span>
                            <span>${match.time}</span>
                        </div>
                        <div class="flex items-center space-x-2 text-sm text-gray-400">
                            <span>👥</span>
                            <span>${match.viewers.toLocaleString()}</span>
                        </div>
                        <div class="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                            <span>▶</span>
                            <span class="text-sm font-semibold">Watch</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `;
}

