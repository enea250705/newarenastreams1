// Node.js script to generate all sport pages
// Run with: node generate-sport-pages.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sports = [
    { id: 'basketball', name: 'Basketball', emoji: '🏀', color: 'bg-orange-500' },
    { id: 'american-football', name: 'American Football', emoji: '🏈', color: 'bg-purple-600' },
    { id: 'hockey', name: 'Hockey', emoji: '🏒', color: 'bg-cyan-500' },
    { id: 'baseball', name: 'Baseball', emoji: '⚾', color: 'bg-blue-500' },
    { id: 'tennis', name: 'Tennis', emoji: '🎾', color: 'bg-yellow-500' },
    { id: 'fight', name: 'UFC / Fight', emoji: '🥊', color: 'bg-red-500' },
    { id: 'cricket', name: 'Cricket', emoji: '🏏', color: 'bg-teal-500' },
    { id: 'rugby', name: 'Rugby', emoji: '🏉', color: 'bg-indigo-500' },
    { id: 'motor-sports', name: 'Motor Sports', emoji: '🏁', color: 'bg-pink-500' }
];

// Read football.html as template
const templatePath = path.join(__dirname, 'football.html');
let template = fs.readFileSync(templatePath, 'utf8');

sports.forEach(sport => {
    let content = template;
    
    // Replace title
    content = content.replace(
        '<title>Football Streams - Arena Streams</title>',
        `<title>${sport.name} Streams - Arena Streams</title>`
    );
    
    // Replace emoji and color
    content = content.replace(
        'class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">',
        `class="w-16 h-16 ${sport.color} rounded-full flex items-center justify-center">`
    );
    content = content.replace(
        '<span class="text-5xl">⚽</span>',
        `<span class="text-5xl">${sport.emoji}</span>`
    );
    
    // Replace name
    content = content.replace(
        '<h1 class="text-3xl font-bold text-white">Football Streams</h1>',
        `<h1 class="text-3xl font-bold text-white">${sport.name} Streams</h1>`
    );
    content = content.replace(
        '<p class="text-gray-400">Watch live football matches in HD quality</p>',
        `<p class="text-gray-400">Watch live ${sport.name.toLowerCase()} matches in HD quality</p>`
    );
    
    // Replace loading text
    content = content.replace(
        '<p class="text-gray-400 mt-4">Loading football matches...</p>',
        `<p class="text-gray-400 mt-4">Loading ${sport.name.toLowerCase()} matches...</p>`
    );
    
    // Replace no matches text
    content = content.replace(
        '<p class="text-gray-400 text-lg">No football matches available at the moment.</p>',
        `<p class="text-gray-400 text-lg">No ${sport.name.toLowerCase()} matches available at the moment.</p>`
    );
    
    // Replace SPORT_ID
    content = content.replace(
        "const SPORT_ID = 'football';",
        `const SPORT_ID = '${sport.id}';`
    );
    
    // Replace console log
    content = content.replace(
        'console.log(`⚽ Loading ${SPORT_ID} matches...`);',
        `console.log(\`${sport.emoji} Loading \${SPORT_ID} matches...\`);`
    );
    
    // Write file
    const outputPath = path.join(__dirname, `${sport.id}.html`);
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✅ Created ${sport.id}.html`);
});

console.log('\n🎉 All sport pages created successfully!');
console.log('📁 Files created in:', __dirname);

