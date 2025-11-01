// Final comprehensive replacement of ALL plumprush scripts
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
        let originalContent = content;
        
        // Replace ALL instances of plumprush scripts using multiple strategies
        
        // Strategy 1: Replace complete script blocks with plumprush.com
        content = content.replace(/<script>[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi, newAdScript);
        
        // Strategy 2: Replace script blocks with function wrapper
        content = content.replace(/<script>[\s\S]*?\(function\([^)]*\)\{[\s\S]*?plumprush\.com[\s\S]*?\}\)\(\)[\s\S]*?<\/script>/gi, newAdScript);
        
        // Strategy 3: Replace comment + script combination
        content = content.replace(/<!--[^>]*[Pp]lumprush[^>]*-->[\s\S]*?<script>[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi, newAdScript);
        
        // Strategy 4: Line-by-line replacement for complex cases
        if (content.includes('plumprush.com')) {
            const lines = content.split('\n');
            const newLines = [];
            let skipUntilScriptEnd = false;
            let scriptStartIndex = -1;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Detect script start with plumprush
                if (line.includes('<script') && !line.includes('</script>') && lines.slice(i, i + 10).join('\n').includes('plumprush.com')) {
                    skipUntilScriptEnd = true;
                    scriptStartIndex = i;
                    // Skip the script opening line
                    continue;
                }
                
                // Detect script end
                if (skipUntilScriptEnd && line.includes('</script>')) {
                    // Insert new script here
                    newLines.push(newAdScript);
                    skipUntilScriptEnd = false;
                    scriptStartIndex = -1;
                    continue;
                }
                
                // Skip lines inside plumprush script
                if (skipUntilScriptEnd) {
                    continue;
                }
                
                newLines.push(line);
            }
            
            content = newLines.join('\n');
        }
        
        // Write back if changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
        
        // Verify
        const hasNew = content.includes('be2de7f311569f44731dcfebc7245428');
        const hasOld = content.includes('plumprush.com');
        
        if (hasNew && !hasOld) {
            console.log(`✅ ${file} - Fully replaced`);
        } else if (hasNew && hasOld) {
            console.log(`⚠️  ${file} - Partially replaced (${(content.match(/plumprush\.com/g) || []).length} remaining)`);
        } else {
            console.log(`❌ ${file} - Failed`);
        }
    }
});

console.log('\n🎉 Final replacement complete!');

