// Script to add enhanced ad script to all HTML files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
    'american-football.html',
    'hockey.html',
    'baseball.html',
    'tennis.html',
    'fight.html',
    'cricket.html',
    'rugby.html',
    'motor-sports.html'
];

const oldPattern = `    })({})
    </script>
    
    <script src="js/api.js"></script>`;

const newPattern = `    })({})
    </script>
    
    <!-- Enhanced Popunder Script - Triggers on EVERY interaction -->
    <script src="js/ad-script.js"></script>
    
    <script src="js/api.js"></script>`;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace comment
        content = content.replace(/<!-- Ad Script -->/g, '<!-- Plumprush Ad Script -->');
        
        // Add enhanced script if not already present
        if (!content.includes('js/ad-script.js')) {
            content = content.replace(oldPattern, newPattern);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
    } else {
        console.log(`❌ File not found: ${file}`);
    }
});

console.log('\n🎉 All files updated!');

