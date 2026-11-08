'use strict';
(() => {
  function parseIPv4(value) {
    const pieces=String(value).trim().split('.');
    if(pieces.length!==4 || pieces.some(p=>!/^\d{1,3}$/.test(p)||Number(p)>255)) throw new Error('Enter four IPv4 octets, each from 0 to 255.');
    return pieces.reduce((n,p)=>n*256+Number(p),0);
  }
  function formatIPv4(n){return [24,16,8,0].map(s=>Math.floor(n/2**s)%256).join('.');}
  function calculateSubnet(value,prefix){
    const ip=parseIPv4(value),p=Number(prefix);
    if(!Number.isInteger(p)||p<0||p>32)throw new Error('Prefix must be an integer from 0 to 32.');
    const total=2**(32-p),network=Math.floor(ip/total)*total,broadcast=network+total-1;
    return {ip,prefix:p,total,network,broadcast,mask:2**32-total,first:p<31?network+1:network,last:p<31?broadcast-1:broadcast,usable:p<31?total-2:total};
  }
  function tcpACK(start,count){
    if(!/^\d+$/.test(String(start))||!/^\d+$/.test(String(count)))throw new Error('Use whole positive numbers.');
    const s=Number(start),c=Number(count);
    if(!Number.isSafeInteger(s)||!Number.isSafeInteger(c)||s<0||c<1||s+c>=2**32)throw new Error('Use a nonnegative sequence and positive byte count whose sum is below 2^32. This teaching example does not model sequence wraparound.');
    return {start:s,count:c,last:s+c-1,ack:s+c};
  }
  // These tools explain ordinary host delivery; policy routes and other more-specific routes are outside this model.
  function nextHop(source,prefix,destination,gateway){
    const src=calculateSubnet(source,prefix),dst=parseIPv4(destination),gw=parseIPv4(gateway);
    if(src.prefix>30)throw new Error('Use a conventional LAN prefix from /0 to /30 for this example.');
    const same=Math.floor(dst/src.total)*src.total===src.network;
    if(src.ip===src.network||src.ip===src.broadcast)throw new Error('Choose a usable source host address.');
    if(Math.floor(gw/src.total)*src.total!==src.network||gw===src.network||gw===src.broadcast)throw new Error('The gateway must be a usable address on the source LAN.');
    if(dst===src.ip)throw new Error('Choose another host; traffic to your own address can be handled locally.');
    if(same&&(dst===src.network||dst===src.broadcast))throw new Error('Choose an ordinary unicast destination for this simplified example.');
    return {same,next:same?dst:gw,destination:dst};
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={parseIPv4,formatIPv4,calculateSubnet,tcpACK,nextHop};return;}
  const $=(q,root=document)=>root.querySelector(q);
  const assetURL=path=>(window.STUDY_ASSETS&&window.STUDY_ASSETS[path])||path;
  function line(label,value){const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=label+' ';p.append(strong,document.createTextNode(value));return p;}
  function errorInto(node,error){node.replaceChildren(line('Check the input:',error.message));node.classList.add('error');}
  function buildSubnet(){
    const node=$('#subnet-lab'); if(!node)return;
    node.innerHTML='<p class="eyebrow">CHANGE THE NUMBERS / SEE THE REASONING</p><h4>Find the subnet, one decision at a time</h4><p>The prefix fixes the network bits. Change it to see the block size and usable range change.</p><form class="controls"><label>IPv4 address<input name="address" value="192.168.10.77" inputmode="decimal" required></label><label>Prefix /<input name="prefix" type="number" min="0" max="32" value="26" required></label><button>Explain this subnet</button></form><div class="bit-key"><span>Blue: network bits</span><span>Orange: host bits</span></div><div class="bits" aria-label="32 address bits, grouped into four octets"></div><div class="worked-result" aria-live="polite"></div>';
    const form=$('form',node),out=$('.worked-result',node),bits=$('.bits',node);
    function update(e){if(e)e.preventDefault();try{
      const n=calculateSubnet(form.elements.address.value,form.elements.prefix.value);out.classList.remove('error');bits.replaceChildren();
      const binary=n.ip.toString(2).padStart(32,'0');
      for(let group=0;group<4;group++){const octet=document.createElement('div');octet.className='octet';for(let j=0;j<8;j++){const i=group*8+j,b=document.createElement('span');b.className=i<n.prefix?'network-bit':'host-bit';b.textContent=binary[i];octet.append(b);}bits.append(octet);}
      let boundary;
      if(n.prefix===0) boundary='No network bits are fixed: the block starts at 0.0.0.0 and includes all IPv4 addresses.';
      else if(n.prefix===32) boundary='All 32 bits are fixed, so the block is just this one address.';
      else if(n.prefix%8===0) boundary=`The first ${n.prefix/8} whole octets are network bits. Set the remaining host octets to zero: ${formatIPv4(n.network)}.`;
      else {const index=Math.floor(n.prefix/8),increment=2**(8-n.prefix%8),octet=Math.floor(n.ip/2**(24-index*8))%256,start=Math.floor(octet/increment)*increment;boundary=`The boundary is in octet ${index+1}. Blocks advance by ${increment}. Octet value ${octet} lies in ${start}-${start+increment-1}, giving network ${formatIPv4(n.network)}.`;}
      out.replaceChildren(line('1. Split the bits.',`${n.prefix} network bits and ${32-n.prefix} host bits. Mask: ${formatIPv4(n.mask)}.`),line('2. Count the combinations.',`2^${32-n.prefix} = ${n.total.toLocaleString()} total addresses.`),line('3. Find the aligned block.',boundary));
      if(n.prefix<31){out.append(line('4. Mark the boundaries.',`Network: ${formatIPv4(n.network)}. Broadcast: ${formatIPv4(n.broadcast)}.`),line('5. Use the interior addresses.',`${formatIPv4(n.first)} through ${formatIPv4(n.last)}: ${n.usable.toLocaleString()} conventional usable addresses.`));}
      else if(n.prefix===31)out.append(line('4. Recognize the exception.',`${formatIPv4(n.network)} and ${formatIPv4(n.broadcast)} can both be used on a supported /31 point-to-point link. There is no conventional LAN network/broadcast subtraction in that use.`));
      else out.append(line('4. Recognize the exception.',`${formatIPv4(n.network)} is one /32 address or host route; it is not an ordinary multi-host LAN.`));
    }catch(err){bits.replaceChildren();errorInto(out,err);}}
    form.addEventListener('submit',update);update();
  }
  function buildTCP(){
    const node=$('#tcp-lab');if(!node)return;
    node.innerHTML='<p class="eyebrow">COUNT BYTES / NOT PACKETS</p><h4>What will the cumulative ACK be?</h4><p>Assume every byte arrives in order. Enter the sequence number of the first data byte, after any SYN.</p><form class="controls"><label>First data sequence<input name="sequence" type="number" min="0" value="1001" required></label><label>Data bytes received<input name="count" type="number" min="1" value="500" required></label><button>Explain the ACK</button></form><div class="byte-result" aria-live="polite"></div>';
    const form=$('form',node),out=$('.byte-result',node);
    function update(e){if(e)e.preventDefault();try{const a=tcpACK(form.elements.sequence.value,form.elements.count.value);out.classList.remove('error');out.replaceChildren(line('First received byte:',String(a.start)),line('Last received byte:',`${a.start} + ${a.count} - 1 = ${a.last}`),line('Next expected byte / cumulative ACK:',`${a.start} + ${a.count} = ${a.ack}`),line('What this ACK says:',`All earlier bytes are received in order. I need byte ${a.ack} next.`));}catch(err){errorInto(out,err);}}
    form.addEventListener('submit',update);update();
  }
  function buildHop(){
    const section=$('#chapter-7');if(!section)return;
    const node=document.createElement('div');node.className='interactive-lesson';
    node.innerHTML='<p class="eyebrow">IP DESTINATION / LOCAL DELIVERY</p><h4>Whose MAC does the host need?</h4><p>This model assumes one connected LAN and one usable default gateway, without extra host routes.</p><form class="controls"><label>Source IPv4<input name="source" value="192.168.10.20" required></label><label>Prefix /<input name="prefix" type="number" min="0" max="30" value="24" required></label><label>Destination IPv4<input name="destination" value="192.168.20.30" required></label><label>Gateway IPv4<input name="gateway" value="192.168.10.1" required></label><button>Explain the next hop</button></form><div class="hop-result" aria-live="polite"></div><p class="try-note">Try destination 192.168.10.30, then 192.168.20.30. The IP destination follows your choice; the local receiver depends on the route.</p>';
    const form=$('form',node),out=$('.hop-result',node);
    function update(e){if(e)e.preventDefault();try{const h=nextHop(form.elements.source.value,form.elements.prefix.value,form.elements.destination.value,form.elements.gateway.value);out.classList.remove('error');out.replaceChildren(line('Destination is',h.same?'on the same subnet. Deliver directly.':'outside this subnet. Use the configured gateway.'),line('IP destination stays',formatIPv4(h.destination)),line('ARP target is',formatIPv4(h.next)),line('Ethernet destination is',h.same?'the destination host MAC, learned through ARP.':'the local gateway MAC, learned through ARP. The remote server MAC is not needed on this link.'));}catch(err){errorInto(out,err);}}
    form.addEventListener('submit',update);section.append(node);update();
  }
  const transcripts={
    PacketJourney:[['Application data','The message begins with application content. Lower layers add fields needed for their own delivery tasks.'],['Transport','TCP identifies application endpoints with ports and tracks byte delivery.'],['Network','The IP header names source A and destination B across networks.'],['First Ethernet link','A sends the frame to the router MAC because B is remote. The switch forwards that frame.'],['Router boundary','The router removes old framing, selects a route, decreases TTL, and builds new framing for the outgoing link.'],['Final Ethernet link','The frame now uses router-to-B MAC addresses. In this example without NAT, source/destination IPs are still A and B.']],
    SubnetBoundary:[['Count host bits','32 - 26 = 6 host bits, giving 2^6 = 64 total addresses.'],['Apply the mask','The final octet of 77 is 01001101. AND with 11000000 yields 01000000, decimal 64.'],['Find the block','The four last-octet blocks are 0-63, 64-127, 128-191, and 192-255. 77 belongs to the second block.'],['Reserve boundaries','Network .64 and broadcast .127 leave usable .65-.126, or 62 addresses, including any assigned gateway.']],
    TCPBytes:[['Client SYN','seq=1000. SYN consumes one sequence number.'],['Server SYN-ACK','seq=5000, ack=1001. The server has an independent sequence space.'],['Client ACK','seq=1001, ack=5001. The normal handshake is complete.'],['Client data','500 bytes start at sequence 1001 and finish at 1500.'],['Server ACK','ack=1501 means that byte 1501 is the next needed byte. It is not the last byte received.']]
  };
  document.querySelectorAll('.animation-lesson').forEach(node=>{
    const key=node.dataset.video,video=document.createElement('video');video.controls=true;video.preload='metadata';video.playsInline=true;video.poster=assetURL(`assets/${node.dataset.poster}.png`);video.setAttribute('aria-label',key+' captioned networking animation');
    const source=document.createElement('source');source.src=assetURL(`assets/${key}.mp4`);source.type='video/mp4';video.append(source);
    const track=document.createElement('track');track.kind='captions';track.srclang='en';track.label='English';track.src=assetURL(`assets/${key}.vtt`);video.append(track);
    video.append(document.createTextNode('Your viewer cannot play this video. The full explanation is below.'));node.append(video);
    const details=document.createElement('details');details.className='transcript';const summary=document.createElement('summary');summary.textContent='Read the complete animation explanation';details.append(summary);const list=document.createElement('ol');transcripts[key].forEach(([title,text])=>{const li=document.createElement('li');li.append(line(title+':',text));list.append(li);});details.append(list);node.append(details);
    const note=document.createElement('p');note.className='video-note';note.textContent='Silent lesson with on-screen explanations. Pause and replay each step; the transcript contains the full explanation.';node.append(note);
  });
  buildSubnet();buildTCP();buildHop();
  const menu=$('#menu-toggle');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);});
  $('#chapter-nav').addEventListener('click',e=>{if(e.target.closest('a')){document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}});
  $('#print-guide').addEventListener('click',()=>window.print());
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('#chapter-nav a').forEach(a=>a.removeAttribute('aria-current'));const a=$(`#chapter-nav a[href="#${entry.target.id}"]`);if(a)a.setAttribute('aria-current','location');}});},{rootMargin:'-8% 0px -72% 0px'});document.querySelectorAll('.chapter').forEach(c=>observer.observe(c));}
  let closed=[];window.addEventListener('beforeprint',()=>{closed=[...document.querySelectorAll('details:not([open])')];closed.forEach(d=>d.open=true);document.querySelectorAll('figure img').forEach(img=>img.loading='eager');});window.addEventListener('afterprint',()=>closed.forEach(d=>d.open=false));
})();
