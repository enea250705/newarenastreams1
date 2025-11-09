const fs = require('fs');
const path = require('path');

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

const intellipopupScript = `    <!-- LOWEST PRIORITY - Intellipopup Script (Loads LAST after all other ads) -->
    <script type="text/javascript" data-cfasync="false">
/*<![CDATA[/* */
(function(){var b=window,n="be2de7f311569f44731dcfebc7245428",i=[["siteId",226+751-664-866+5241720],["minBid",0],["popundersPerIP","30:5"],["delayBetween",0],["default",true],["defaultPerDay",0],["topmostLayer","auto"]],f=["d3d3LmludGVsbGlwb3B1cC5jb20vd3BlZXJqcy5taW4uY3Nz","ZDNtcjd5MTU0ZDJxZzUuY2xvdWRmcm9udC5uZXQvcW4vb2hpZ2hsaWdodGVyLm1pbi5qcw=="],y=-1,u,q,d=function(){clearTimeout(q);y++;if(f[y]&&!(1788629682000<(new Date).getTime()&&1<y)){u=b.document.createElement("script");u.type="text/javascript";u.async=!0;var a=b.document.getElementsByTagName("script")[0];u.src="https://"+atob(f[y]);u.crossOrigin="anonymous";u.onerror=d;u.onload=function(){clearTimeout(q);b[n.slice(0,16)+n.slice(0,16)]||d()};q=setTimeout(d,5E3);a.parentNode.insertBefore(u,a)}};if(!b[n]){try{Object.freeze(b[n]=i)}catch(e){}d()}})();
/*]]>/* */
</script>`;

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Remove intellipopup script from wherever it is in head
        content = content.replace(/<!-- LOWEST PRIORITY - Intellipopup Script[^>]*>[\s\S]*?226\+751-664-866\+5241720[\s\S]*?<\/script>/g, '');
        content = content.replace(/<!-- HIGHEST PRIORITY - Intellipopup Script[^>]*>[\s\S]*?226\+751-664-866\+5241720[\s\S]*?<\/script>/g, '');
        
        // Find the closing </body> tag and insert intellipopup before it
        const bodyClosePattern = /(\s*<\/body>)/;
        const match = content.match(bodyClosePattern);
        
        if (match && !content.includes('226+751-664-866+5241720')) {
            const insertPoint = match.index;
            content = content.slice(0, insertPoint) + '\n' + intellipopupScript + content.slice(insertPoint);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Moved intellipopup to end in ${file}`);
        } else {
            console.log(`- No changes needed in ${file}`);
        }
    } catch (error) {
        console.error(`✗ Error updating ${file}:`, error.message);
    }
});

console.log('\n✅ Intellipopup moved to end - all other ads load first!');

