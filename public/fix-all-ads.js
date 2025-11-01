// Final script to replace ALL remaining plumprush scripts
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
        
        // Find and replace ALL script blocks containing plumprush
        // Pattern: <script>...plumprush.com...</script>
        const patterns = [
            /<script>[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi,
            /<script[\s\S]*?>[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi
        ];
        
        let replaced = false;
        patterns.forEach(pattern => {
            if (pattern.test(content)) {
                content = content.replace(pattern, newAdScript);
                replaced = true;
            }
        });
        
        // Also replace the comment + script combination
        const commentPattern = /<!--[^>]*Plumprush[^>]*-->[\s\S]*?<script>[\s\S]*?plumprush\.com[\s\S]*?<\/script>/gi;
        if (commentPattern.test(content)) {
            content = content.replace(commentPattern, newAdScript);
            replaced = true;
        }
        
        // More aggressive: find any script with plumprush in head or body
        if (content.includes('plumprush.com')) {
            // Find the script tag start and end
            const lines = content.split('\n');
            let newLines = [];
            let inScript = false;
            let scriptBuffer = [];
            let foundPlumprush = false;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                if (line.includes('<script') && !line.includes('</script>')) {
                    inScript = true;
                    scriptBuffer = [line];
                    foundPlumprush = line.includes('plumprush.com');
                } else if (inScript) {
                    scriptBuffer.push(line);
                    if (line.includes('plumprush.com')) {
                        foundPlumprush = true;
                    }
                    if (line.includes('</script>')) {
                        inScript = false;
                        if (foundPlumprush) {
                            // Replace with new script
                            newLines.push(newAdScript);
                            foundPlumprush = false;
                        } else {
                            newLines.push(...scriptBuffer);
                        }
                        scriptBuffer = [];
                    }
                } else {
                    newLines.push(line);
                }
            }
            
            if (foundPlumprush) {
                content = newLines.join('\n');
                replaced = true;
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        
        const hasNew = content.includes('be2de7f311569f44731dcfebc7245428');
        const hasOld = content.includes('plumprush.com');
        
        if (hasNew && !hasOld) {
            console.log(`✅ ${file} - Fully updated`);
        } else if (hasNew && hasOld) {
            console.log(`⚠️  ${file} - Partially updated (still has plumprush)`);
        } else {
            console.log(`❌ ${file} - Failed to update`);
        }
    }
});

console.log('\n🎉 All files processed!');

