import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = [
    'index.html',
    'matches.html',
    'watch.html',
    'football.html',
    'basketball.html',
    'american-football.html',
    'hockey.html',
    'baseball.html',
    'tennis.html',
    'fight.html',
    'cricket.html',
    'rugby.html',
    'motor-sports.html'
];

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Remove inline redirect blocker (multiline pattern)
        const inlineBlockerPattern = /<!-- Redirect Blocker - MUST LOAD FIRST to prevent immediate redirects -->[\s\S]*?<\/script>\s*/g;
        content = content.replace(inlineBlockerPattern, '');
        
        // Remove external redirect blocker script reference
        content = content.replace(/<!-- Redirect Blocker - Prevents immediate redirects on page load -->\s*<script src="js\/prevent-immediate-redirects\.js"><\/script>/g, '');
        
        // Clean up extra blank lines
        content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Removed redirect blocker from ${file}`);
        } else {
            console.log(`- No redirect blocker found in ${file}`);
        }
    } catch (error) {
        console.error(`✗ Error updating ${file}:`, error.message);
    }
});

console.log('\n✅ Redirect blocker removed from all pages!');

