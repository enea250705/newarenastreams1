// Script to add full navbar to all sport pages
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const navbarHtml = `                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center space-x-6">
                    <a href="index.html" class="text-gray-300 hover:text-blue-400 text-sm">Home</a>
                    <a href="matches.html" class="text-gray-300 hover:text-blue-400 text-sm">All Matches</a>
                    
                    <!-- Sports Dropdown -->
                    <div class="relative group">
                        <button class="text-gray-300 hover:text-blue-400 text-sm flex items-center space-x-1">
                            <span>Sports</span>
                            <span>▼</span>
                        </button>
                        <div class="absolute hidden group-hover:block top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                            <a href="football.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">⚽</span>
                                <span class="text-sm text-gray-300">Football</span>
                            </a>
                            <a href="basketball.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🏀</span>
                                <span class="text-sm text-gray-300">Basketball</span>
                            </a>
                            <a href="american-football.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🏈</span>
                                <span class="text-sm text-gray-300">American Football</span>
                            </a>
                            <a href="hockey.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🏒</span>
                                <span class="text-sm text-gray-300">Hockey</span>
                            </a>
                            <a href="baseball.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">⚾</span>
                                <span class="text-sm text-gray-300">Baseball</span>
                            </a>
                            <a href="tennis.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🎾</span>
                                <span class="text-sm text-gray-300">Tennis</span>
                            </a>
                            <a href="fight.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🥊</span>
                                <span class="text-sm text-gray-300">UFC / Fight</span>
                            </a>
                            <a href="cricket.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🏏</span>
                                <span class="text-sm text-gray-300">Cricket</span>
                            </a>
                            <a href="rugby.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🏉</span>
                                <span class="text-sm text-gray-300">Rugby</span>
                            </a>
                            <a href="motor-sports.html" class="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700">
                                <span class="text-xl">🏁</span>
                                <span class="text-sm text-gray-300">Motor Sports</span>
                            </a>
                        </div>
                    </div>
                </nav>
                
                <!-- Mobile Menu Button -->
                <button id="mobile-menu-btn" class="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
                    <span class="text-2xl">☰</span>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden lg:hidden py-4 space-y-2">
                <a href="index.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">Home</a>
                <a href="matches.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">All Matches</a>
                <div class="pt-2 pb-1 px-4 text-xs text-gray-500 uppercase font-semibold">Sports</div>
                <a href="football.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">⚽ Football</a>
                <a href="basketball.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🏀 Basketball</a>
                <a href="american-football.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🏈 American Football</a>
                <a href="hockey.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🏒 Hockey</a>
                <a href="baseball.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">⚾ Baseball</a>
                <a href="tennis.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🎾 Tennis</a>
                <a href="fight.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🥊 UFC / Fight</a>
                <a href="cricket.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🏏 Cricket</a>
                <a href="rugby.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🏉 Rugby</a>
                <a href="motor-sports.html" class="block px-4 py-2 rounded-lg hover:bg-slate-800">🏁 Motor Sports</a>
            </div>`;

const sportFiles = [
    { file: 'football.html', name: 'Football' },
    { file: 'basketball.html', name: 'Basketball' },
    { file: 'american-football.html', name: 'American Football' },
    { file: 'hockey.html', name: 'Hockey' },
    { file: 'baseball.html', name: 'Baseball' },
    { file: 'tennis.html', name: 'Tennis' },
    { file: 'fight.html', name: 'UFC / Fight' },
    { file: 'cricket.html', name: 'Cricket' },
    { file: 'rugby.html', name: 'Rugby' },
    { file: 'motor-sports.html', name: 'Motor Sports' }
];

sportFiles.forEach(({ file, name }) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the header section and replace minimal nav with full nav
        const headerPattern = /(<header[^>]*>[\s\S]*?<\/a>)([\s\S]*?)(<\/div>\s*<\/header>)/;
        const match = content.match(headerPattern);
        
        if (match) {
            // Replace everything between </a> and </div></header> with full navbar
            const newHeader = match[1] + '\n                \n' + navbarHtml + '\n        ' + match[3];
            content = content.replace(headerPattern, newHeader);
            
            // Add mobile menu toggle script if not present
            if (!content.includes('mobile-menu-btn')) {
                // Script should already be there from template, but ensure it exists
                const scriptPattern = /(<script[^>]*>)/;
                if (!content.includes('getElementById(\'mobile-menu-btn\')')) {
                    const scriptTag = content.match(/<script[^>]*src="js\/home\.js">/);
                    if (scriptTag) {
                        const beforeScript = content.substring(0, scriptTag.index);
                        const afterScript = content.substring(scriptTag.index + scriptTag[0].length);
                        content = beforeScript + scriptTag[0] + `
    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    </script>` + afterScript;
                    }
                }
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated navbar in ${file}`);
        } else {
            console.log(`⚠️ Could not find header pattern in ${file}`);
        }
    } else {
        console.log(`❌ File not found: ${file}`);
    }
});

console.log('\n🎉 All navbars updated!');

