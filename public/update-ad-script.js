// Script to replace plumprush ad script with intellipopup
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newAdScript = `    <!-- Intellipopup Ad Script -->
    <script type="text/javascript" data-cfasync="false">
    /*<![CDATA[/* */
    (function(){var v=window,w="be2de7f311569f44731dcfebc7245428",k=[["siteId",955-151+428*882+4862867],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],o=["d3d3LmludGVsbGlwb3B1cC5jb20vdnFIL3lqcXVlcnkuc3RlbGxhci5taW4uanM=","ZDNtcjd5MTU0ZDJxZzUuY2xvdWRmcm9udC5uZXQvVC93cS92c3FsLmNzcw=="],x=-1,l,u,j=function(){clearTimeout(u);x++;if(o[x]&&!(1787911315000<(new Date).getTime()&&1<x)){l=v.document.createElement("script");l.type="text/javascript";l.async=!0;var s=v.document.getElementsByTagName("script")[0];l.src="https://"+atob(o[x]);l.crossOrigin="anonymous";l.onerror=j;l.onload=function(){clearTimeout(u);v[w.slice(0,16)+w.slice(0,16)]||j()};u=setTimeout(j,5E3);s.parentNode.insertBefore(l,s)}};if(!v[w]){try{Object.freeze(v[w]=k)}catch(e){}j()}})();
    /*]]>/* */
    </script>`;

// Multiple patterns to catch all variations including head scripts
const oldScriptPatterns = [
    /<!-- Plumprush Ad Script -->[\s\S]*?<script>[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi,
    /<script>[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi,
    /<script[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi,
    /<script>[\s\S]*?\(function\([^)]*\)\{[\s\S]*?plumprush\.com[\s\S]*?\}\)\(\)[\s\S]*?<\/script>/gi
];

const files = [
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

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace ALL plumprush scripts with new intellipopup script
        oldScriptPatterns.forEach(pattern => {
            if (content.includes('plumprush.com')) {
                content = content.replace(pattern, newAdScript);
            }
        });
        
        // Double-check: replace any remaining plumprush references
        if (content.includes('plumprush.com')) {
            // More aggressive pattern
            const aggressivePattern = /<script[^>]*>[\s\S]{0,2000}?plumprush\.com[\s\S]{0,2000}?<\/script>/gi;
            content = content.replace(aggressivePattern, newAdScript);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        
        // Check if replacement worked
        const hasNewScript = content.includes('be2de7f311569f44731dcfebc7245428');
        const hasOldScript = content.includes('plumprush.com');
        
        if (hasNewScript && !hasOldScript) {
            console.log(`✅ Updated ${file} - All scripts replaced`);
        } else if (hasNewScript && hasOldScript) {
            console.log(`⚠️  Updated ${file} - Some scripts replaced (${hasOldScript ? 'old still present' : 'ok'})`);
        } else {
            console.log(`❌ Failed to update ${file}`);
        }
    } else {
        console.log(`❌ File not found: ${file}`);
    }
});

console.log('\n🎉 All ad scripts updated to intellipopup!');

