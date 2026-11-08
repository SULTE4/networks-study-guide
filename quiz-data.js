'use strict';
// Chapter quizzes. Each item is [question, correct option, [wrong options], why].
// Options are shuffled when shown. Text between backticks renders as code.
(function (root) {
  const BANK = {
    'chapter-1': { title: 'Network fundamentals', items: [
      ["Laptops A and B share one switch and one /24. Which device and field move A's frame to B?", "The switch, using the destination MAC", ["A router, using the destination IP", "The switch, using the destination IP", "A router, using the source MAC"], "Same subnet means local delivery. The switch looks up the destination MAC in its table; no router is involved."],
      ["Which statement about clients and servers is correct?", "They are roles, so one computer can be both", ["A server can never request a service", "A client is any host without an IP address", "They describe how a device is cabled"], "Client and server describe who requests and who provides in a given exchange, not a type of hardware."],
      ["A full mesh connects 6 routers. How many point-to-point links are needed?", "15", ["6", "12", "30"], "n(n-1)/2 = 6 x 5 / 2 = 15."],
      ["Which term means the rate of data actually transferred successfully?", "Throughput", ["Bandwidth", "Jitter", "Latency"], "Bandwidth is nominal capacity. Throughput is what you really achieved under the measured conditions."],
      ["Voice breaks up because the delay between packets keeps changing. What is that called?", "Jitter", ["Attenuation", "Bandwidth", "Goodput"], "Jitter is variation in delay. Real-time traffic is sensitive to it."],
      ["Ideally, how long does a 15 MB file take on a 40 Mb/s link?", "3 s", ["0.375 s", "6 s", "24 s"], "15 MB x 8 = 120 Mb, and 120 / 40 = 3 s, before overhead and other delays."],
      ["What does QoS actually do?", "Classifies and schedules competing traffic", ["Adds bandwidth when a link becomes full", "Encrypts delay-sensitive traffic", "Resends packets lost on the link"], "QoS decides who goes first. It cannot create capacity that does not exist."],
      ["A company lets a partner reach a few internal services under control. That is:", "An extranet", ["An intranet", "A PAN", "A WLAN"], "An intranet is internal only. An extranet grants controlled access to outsiders."]
    ]},
    'chapter-2': { title: 'Models, protocols, and encapsulation', items: [
      ["What is the PDU of TCP at the transport layer?", "Segment", ["Frame", "Packet", "Bits"], "Transport: segment. Network: packet. Data link: frame. Physical: bits."],
      ["Which OSI layer handles logical addressing and routing?", "Network", ["Data Link", "Transport", "Session"], "Layer 3 carries IP addresses and makes routing decisions."],
      ["The TCP/IP Application layer corresponds to which OSI layers?", "OSI 5, 6 and 7", ["OSI 4 and 5", "OSI 6 and 7 only", "OSI 7 only"], "Application, Presentation and Session collapse into one TCP/IP layer."],
      ["On an ordinary routed hop without NAT, what is rewritten?", "Source and destination MAC addresses", ["Source and destination IP addresses", "Source and destination TCP ports", "The application data"], "Each Ethernet hop gets a new frame. IP endpoints stay the same, although TTL does decrease."],
      ["Which order is correct when a host sends data?", "Data, segment, packet, frame, bits", ["Data, packet, segment, frame, bits", "Data, frame, packet, segment, bits", "Bits, frame, packet, segment, data"], "Each lower layer wraps the one above it. The reverse order is decapsulation on the receiver."],
      ["Who publishes Internet standards as RFCs?", "IETF", ["IEEE", "TIA/EIA", "ISO"], "IETF writes RFCs. IEEE writes LAN standards such as Ethernet and Wi-Fi."],
      ["Which body develops the Ethernet and WLAN standards?", "IEEE", ["IETF", "IANA", "ICANN"], "802.3 is Ethernet and 802.11 is Wi-Fi, both from IEEE."],
      ["In a connection to a remote server on 443, what does 443 identify?", "The service endpoint on that server", ["The next router on the path", "The local switch port", "The destination network"], "Ports identify the application endpoint. IP finds the host, MAC finds the next receiver on the link."],
      ["What does IPv6 use in place of broadcast?", "Multicast", ["Anycast", "Loopback", "Unicast flooding"], "IPv6 has no broadcast. Groups such as ff02::1 do that work."]
    ]},
    'chapter-3': { title: 'Cisco IOS and basic device configuration', items: [
      ["What mode does the prompt `Switch(config-if)#` show?", "Interface configuration", ["Global configuration", "Privileged EXEC", "Line configuration"], "`(config-if)` means an interface is selected for editing."],
      ["Which command makes the current configuration survive a reboot?", "`copy running-config startup-config`", ["`copy startup-config running-config`", "`show running-config`", "`write terminal`"], "It copies RAM to NVRAM. The reverse direction would load the saved config over the active one."],
      ["Where is the running configuration held?", "RAM", ["NVRAM", "Flash", "ROM"], "RAM is volatile. Startup config is commonly in NVRAM and the IOS image in flash."],
      ["What does `service password-encryption` do?", "Applies weak reversible obfuscation to passwords", ["Encrypts Telnet sessions end to end", "Replaces the enable secret hash", "Turns on SSH for the VTY lines"], "It is Type 7 obfuscation of stored passwords. It does nothing for traffic on the wire."],
      ["Why give a Layer 2 switch an address on interface VLAN 1?", "So the switch itself can be managed remotely", ["So PCs can forward frames through it", "So it becomes the PCs' default gateway", "So it creates another broadcast domain"], "A switch forwards frames without any IP. The SVI is only the switch's own management address."],
      ["`show ip interface brief` lists `administratively down`. What is the fix?", "Enter `no shutdown` on that interface", ["Replace the cable on that interface", "Enter `ip routing` in global mode", "Reload the device and try again"], "Administratively down means it was disabled by configuration."],
      ["Which is needed before `crypto key generate rsa` in the usual workflow?", "A hostname and an IP domain name", ["A DHCP pool on the device", "Telnet enabled on the VTY lines", "A default static route"], "IOS names the RSA key after hostname and domain name."],
      ["What does `transport input ssh` under `line vty 0 4` do?", "Allows only SSH on those VTY lines", ["Generates the SSH key pair", "Sets the SSH username and secret", "Enables SSH version 2 globally"], "It restricts which remote protocols the lines accept, so Telnet is refused."],
      ["What must be entered for a router to forward IPv6 between interfaces?", "`ipv6 unicast-routing`", ["`ipv6 enable`", "`ip routing ipv6`", "`ipv6 address autoconfig`"], "Without it the router has addresses but does not forward IPv6 or send RAs."]
    ]},
    'chapter-4': { title: 'Physical layer, number systems, and wireless', items: [
      ["A signal weakens as cable length grows. What is that called?", "Attenuation", ["Crosstalk", "Jitter", "Multiplexing"], "Crosstalk is coupling between nearby conductors. Attenuation is loss over distance."],
      ["What is binary `11001000` in decimal?", "200", ["192", "208", "216"], "128 + 64 + 8 = 200."],
      ["What is hexadecimal `AC` in decimal?", "172", ["162", "182", "192"], "A = 10, so 10 x 16 + 12 = 172."],
      ["Which medium is immune to electromagnetic interference?", "Fiber", ["UTP", "STP", "Coaxial"], "Fiber carries light. It can still suffer bending loss, dirty connectors and damage."],
      ["Which pairing is correct?", "Single-mode: small core, long distance", ["Single-mode: large core, short distance", "Multimode: small core, long distance", "Multimode: copper core, short distance"], "Single-mode suits long optical links. Multimode's larger core suits shorter building and campus links."],
      ["Which access method does Wi-Fi use?", "CSMA/CA", ["CSMA/CD", "Token passing", "Circuit switching"], "Radios cannot reliably detect collisions while sending, so WLANs avoid them. CSMA/CD is legacy half-duplex Ethernet."],
      ["Which channel set is commonly used to avoid overlap at 2.4 GHz?", "1, 6, 11", ["1, 2, 3", "2, 4, 6", "5, 10, 15"], "With 20 MHz channels, 1, 6 and 11 are the usual non-overlapping plan."],
      ["How long does a 1,000-byte packet take to serialize at 10 Mb/s?", "0.8 ms", ["0.1 ms", "8 ms", "80 ms"], "8,000 bits / 10,000,000 b/s = 0.0008 s."],
      ["Which cable is used for a console connection?", "Rollover", ["Crossover", "Straight-through", "Coaxial"], "A console or rollover cable is for management, not ordinary Ethernet forwarding."],
      ["Wi-Fi shows strong RSSI but performs badly near a microwave. Which measure is likely poor?", "SNR", ["SSID", "BSSID", "MTU"], "RSSI is signal strength alone. SNR compares that signal to the noise."]
    ]},
    'chapter-5': { title: 'Data link layer and Ethernet switching', items: [
      ["What does a switch learn from an incoming frame?", "The source MAC on the arrival port", ["The destination MAC on the arrival port", "The source IP on the arrival port", "The destination IP on the exit port"], "Arrival proves where the sender is. It proves nothing about the destination."],
      ["What does a switch do with a unicast frame to an unknown MAC?", "Floods it in the VLAN except the incoming port", ["Drops it and sends an ICMP error", "Rewrites it to the broadcast address", "Returns it out of the incoming port"], "That is unknown-unicast flooding. The destination MAC stays unchanged."],
      ["What is the Ethernet broadcast MAC?", "`ff:ff:ff:ff:ff:ff`", ["`00:00:00:00:00:00`", "`01:00:5e:00:00:00`", "`33:33:00:00:00:00`"], "All ones. `01:00:5e` and `33:33` are IPv4 and IPv6 multicast prefixes."],
      ["What is the size range of a basic untagged Ethernet frame?", "64 to 1518 bytes", ["46 to 1500 bytes", "64 to 1500 bytes", "18 to 1522 bytes"], "Counted from destination MAC through FCS. 46 to 1500 is the payload alone."],
      ["What does the FCS do?", "Detects corruption in the frame", ["Encrypts the frame payload", "Repairs flipped bits in the frame", "Identifies the payload protocol"], "A CRC check detects errors and the frame is usually dropped. EtherType identifies the payload."],
      ["Which EtherType identifies IPv6?", "`0x86DD`", ["`0x0800`", "`0x0806`", "`0x8100`"], "`0x0800` is IPv4, `0x0806` is ARP, `0x8100` is an 802.1Q tag."],
      ["Which forwarding method checks the FCS before sending?", "Store-and-forward", ["Cut-through", "Fragment-free", "Unknown-unicast"], "It receives the whole frame first. Cut-through starts early and can pass on corrupted frames."],
      ["A 24-port switch has every port in one VLAN. How many collision and broadcast domains?", "24 collision, 1 broadcast", ["1 collision, 24 broadcast", "24 collision, 24 broadcast", "1 collision, 1 broadcast"], "Each port is its own collision domain. One VLAN is one broadcast domain."],
      ["What is required for hosts in different VLANs to communicate?", "Layer 3 routing", ["A longer MAC table timeout", "A second access port", "A crossover cable"], "Each VLAN is a separate broadcast domain, so traffic between them must be routed."],
      ["Why are uncontrolled Layer 2 loops so damaging?", "Ethernet frames have no hop counter", ["Switches cannot read MAC addresses twice", "Broadcasts are always encrypted", "Routers forward every VLAN by default"], "Without a TTL, frames circulate forever. STP keeps a loop-free active topology."]
    ]},
    'chapter-6': { title: 'Network layer and routing', items: [
      ["A router has several routes that match a destination. Which one wins?", "The longest matching prefix", ["The route that was added first", "The route with the lowest next hop", "The default route"], "Most specific wins. A default route only catches what nothing else matched."],
      ["Routes: `0.0.0.0/0`, `10.0.0.0/8`, `10.2.0.0/16`, `10.2.3.0/24`. Which is used for 10.2.200.1?", "`10.2.0.0/16`", ["`10.2.3.0/24`", "`10.0.0.0/8`", "`0.0.0.0/0`"], "10.2.200.1 is not in 10.2.3.0/24, so the /16 is the longest prefix that matches."],
      ["What does best-effort delivery mean for IP?", "Arrival and order are not guaranteed", ["Every packet is retransmitted once", "A session is set up before sending", "Only encrypted traffic is delivered"], "IP is connectionless and best effort. Reliability belongs to upper layers."],
      ["What does a router do to the IPv4 TTL when forwarding?", "Decrements it by one", ["Resets it to 255", "Copies it unchanged", "Doubles it"], "TTL limits a packet's life. At zero the packet is dropped and Time Exceeded may be returned."],
      ["What are the IPv4 minimum and IPv6 base header sizes?", "20 bytes and 40 bytes", ["40 bytes and 20 bytes", "20 bytes and 20 bytes", "8 bytes and 40 bytes"], "IPv6 is a fixed 40-byte base header despite having fewer fields, because its addresses are larger."],
      ["In `show ip route`, what does the code `C` mean?", "Directly connected network", ["Cisco proprietary route", "Candidate default route", "Configured static route"], "`C` connected, `L` local interface address, `S` static, `O` OSPF."],
      ["When does administrative distance matter?", "Between competing sources for the same prefix", ["Between a /16 and a /24 for one destination", "Only when the default route is missing", "Only for directly connected routes"], "Prefix length is decided first. AD only compares routes to the identical prefix."],
      ["What is the value of the IPv4 Protocol field for TCP?", "6", ["1", "17", "58"], "ICMP is 1, TCP is 6, UDP is 17, ICMPv6 is 58."],
      ["An IPv6 packet is larger than a link's MTU. What does the router do?", "Drops it and sends Packet Too Big", ["Fragments it and forwards the pieces", "Compresses the extension headers", "Forwards it and sets a flag"], "IPv6 routers never fragment. Only the source can."],
      ["Which is a valid static route to 192.168.20.0/24 via 10.0.0.2?", "`ip route 192.168.20.0 255.255.255.0 10.0.0.2`", ["`ip route 192.168.20.0/24 10.0.0.2`", "`ip route 10.0.0.2 255.255.255.0 192.168.20.0`", "`route add 192.168.20.0 10.0.0.2`"], "Syntax is network, dotted mask, next hop. Remember a return route on the other router."]
    ]},
    'chapter-7': { title: 'ARP and IPv6 Neighbor Discovery', items: [
      ["Host 192.168.10.20/24 sends to 192.168.20.30. Whose MAC does it ARP for?", "Its default gateway's", ["192.168.20.30's", "The DNS server's", "The switch's"], "The destination is remote, so the frame goes to the router. The IP destination stays 192.168.20.30."],
      ["How are an ARP request and an ARP reply normally sent?", "Request broadcast, reply unicast", ["Request unicast, reply broadcast", "Both are sent as broadcast", "Both are sent as multicast"], "Nobody knows the target's MAC yet, so the question is broadcast. The answer goes straight back."],
      ["What is ARP carried in?", "Directly in an Ethernet frame", ["A UDP datagram on port 53", "A TCP segment on port 80", "An ICMP message"], "ARP has EtherType `0x0806`, and no IP header or port."],
      ["What does IPv6 use instead of ARP?", "ICMPv6 Neighbor Solicitation and Advertisement", ["DHCPv6 Request and Reply", "ICMPv6 Echo Request and Reply", "ARPv6 broadcast and reply"], "Neighbor Discovery runs over ICMPv6 and uses multicast rather than broadcast."],
      ["Which ICMPv6 type number is a Router Advertisement?", "134", ["133", "135", "136"], "133 RS, 134 RA, 135 NS, 136 NA, 137 Redirect."],
      ["What is the solicited-node multicast address for a target ending in `:1234:5678`?", "`ff02::1:ff34:5678`", ["`ff02::1:ff12:3456`", "`ff02::2:ff34:5678`", "`ff02::1:1234:5678`"], "Prefix `ff02::1:ff00:0/104` plus the final 24 bits, which are `34:5678`."],
      ["What does Duplicate Address Detection check?", "That no one on the link already uses the address", ["That the address is globally registered", "That the router has a route to the prefix", "That DHCPv6 has reserved the address"], "DAD uses Neighbor Solicitation for the tentative address on the local link."],
      ["A switch sends known unicast out of the wrong port. Which table do you inspect?", "The MAC address table", ["The ARP cache", "The routing table", "The DNS cache"], "MAC table: MAC to port. ARP cache: IP to MAC. Routing table: prefix to next hop."]
    ]},
    'chapter-8': { title: 'IPv4 addressing and subnetting', items: [
      ["What is the network address of 10.50.77.200/18?", "10.50.64.0", ["10.50.0.0", "10.50.72.0", "10.50.76.0"], "/18 has block 64 in the 3rd octet. 77 lies in 64 to 127."],
      ["What is the broadcast address of 192.168.7.100/27?", "192.168.7.127", ["192.168.7.95", "192.168.7.126", "192.168.7.128"], "Block 32. 100 lies in 96 to 127, and broadcast is the last address."],
      ["How many usable host addresses does a /22 have?", "1022", ["510", "1024", "2046"], "2^10 - 2 = 1022."],
      ["What is the dotted mask for /21?", "255.255.248.0", ["255.255.240.0", "255.255.252.0", "255.255.255.248"], "/21 = 16 + 5 bits, and 11111000 = 248 in the 3rd octet."],
      ["A LAN needs 64 usable addresses. What is the smallest prefix that works?", "/25", ["/26", "/27", "/24"], "/26 gives only 62 usable, so go to /25 with 126."],
      ["How many /27 subnets fit in a /23?", "16", ["8", "14", "32"], "27 - 23 = 4 borrowed bits, and 2^4 = 16. Do not subtract 2 from a subnet count."],
      ["Which address is in RFC 1918 private space?", "172.20.5.1", ["172.32.5.1", "172.15.5.1", "169.254.5.1"], "The private 172 range is 172.16 to 172.31. 169.254 is link-local."],
      ["A host shows 169.254.13.7. What does that suggest?", "It got no usable DHCP lease", ["It is using a private ISP address", "It is a multicast group member", "It holds the default route"], "169.254.0.0/16 is IPv4 link-local, often seen when DHCP fails."],
      ["Which of these is a valid host address?", "172.16.5.0 /23", ["172.16.4.0 /23", "172.16.5.255 /23", "172.16.6.0 /23"], "172.16.4.0/23 runs to 172.16.5.255, so 172.16.5.0 is inside. An address ending in .0 can be a host."],
      ["In VLSM, how should subnets be allocated?", "Largest requirement first, on aligned boundaries", ["Smallest requirement first, on any boundary", "In the order the departments were listed", "Equal sizes first, then the point-to-point links"], "Largest first keeps blocks aligned and leaves contiguous space for smaller ones."],
      ["Which pair summarizes exactly to one /23?", "192.168.0.0/24 and 192.168.1.0/24", ["192.168.1.0/24 and 192.168.2.0/24", "192.168.3.0/24 and 192.168.4.0/24", "192.168.5.0/24 and 192.168.6.0/24"], "A /23 must start on an even 3rd octet, so the pair has to begin at an even number."],
      ["Which is the correct way to get the number of equal subnets from borrowed bits?", "2^borrowed bits", ["2^borrowed bits - 2", "2^host bits - 2", "2^host bits"], "The minus 2 applies to hosts per subnet only."],
      ["A department of 300 hosts is part of a /22 VLSM plan. What prefix does it need?", "/23", ["/24", "/22", "/25"], "A /24 holds only 254 usable, so go one step larger. A /23 holds 510."],
      ["Two routers are directly connected in a VLSM plan. Which prefix suits their link?", "/30", ["/29", "/32", "/24"], "The link needs 2 usable addresses, and 2^2 - 2 = 2."],
      ["In a VLSM plan, a /25 starts at 172.18.46.0. Where can the next block start?", "172.18.46.128", ["172.18.46.126", "172.18.46.127", "172.18.47.0"], "The /25 ends with broadcast .127, so the next block starts one address later."]
    ]},
    'chapter-9': { title: 'IPv6 addressing and configuration', items: [
      ["How many zero hextets does `::` replace in `2001:db8::1:0:2`?", "3", ["2", "4", "5"], "Five groups are written, and 8 - 5 = 3."],
      ["What is the canonical short form of `2001:0db8:0000:0000:00a0:0000:0000:0001`?", "`2001:db8::a0:0:0:1`", ["`2001:db8::a:0:0:1`", "`2001:db8::a0::1`", "`2001:db8:0:0:a0::1`"], "Equal runs of zeros: compress the leftmost. `a0` keeps its trailing zero, and `::` may appear only once."],
      ["Which is a global unicast address?", "`3001:abcd:12::1`", ["`fe90::a1`", "`fd12:3456:789a::1`", "`ff02::1`"], "2000::/3 includes everything starting with 2 or 3."],
      ["What type of address is `fe90::a1`?", "Link-local", ["Global unicast", "Unique local", "Multicast"], "fe80::/10 covers fe80 through febf."],
      ["What is `ff02::2`?", "All routers on the link", ["All nodes on the link", "The loopback address", "The unspecified address"], "`ff02::1` is all nodes, and `::1` is loopback."],
      ["How many /64 subnets fit in a /56?", "256", ["16", "65,536", "254"], "2^(64-56) = 2^8 = 256. There is no minus 2 in IPv6 subnet counts."],
      ["What follows `2001:db8:acad:9::/64` when counting subnet IDs?", "`2001:db8:acad:a::/64`", ["`2001:db8:acad:10::/64`", "`2001:db8:acad:90::/64`", "`2001:db8:acad:9a::/64`"], "Count in hex. After 9 comes a. Subnet 10 hex is number 16."],
      ["Using EUI-64, what is the interface ID for MAC `5c:26:0a:11:22:33`?", "`5e26:0aff:fe11:2233`", ["`5c26:0aff:fe11:2233`", "`5e26:0a11:22ff:fe33`", "`5c26:ff0a:fe11:2233`"], "Split the MAC, insert `ff:fe`, flip the 7th bit: 5c = 01011100 becomes 01011110 = 5e."],
      ["In SLAAC with stateless DHCPv6, where does the host get its address and its DNS info?", "Address via SLAAC, DNS via DHCPv6", ["Both via stateful DHCPv6 leases", "Address via DHCPv6, DNS via SLAAC", "Both via manual configuration"], "The RA tells the host to build its own address and ask DHCPv6 for other options."],
      ["How does an IPv6 host normally learn its default gateway?", "From the source of the Router Advertisement", ["From a DHCPv6 default-router option", "From an ARP reply on the link", "From the AAAA record of the router"], "The gateway is the router's link-local address, as seen in the RA."],
      ["Is `fe80::50a5:8a35:a5bb:66e1` EUI-64 or random?", "Random: no `ff:fe` in the middle", ["EUI-64: it starts with `fe80`", "EUI-64: it has a 64-bit interface ID", "Random: it has no 7th bit set"], "EUI-64 interface IDs always have `ff:fe` in bytes 4 and 5."],
      ["Are `2001:db8:acad:1::1` and `2001:db8:acad:10::1` in the same /64?", "No, subnet ID 0001 differs from 0010", ["Yes, the first three hextets match", "Yes, both end in the same `::1`", "No, one of them is link-local"], "A /64 compares the first four hextets. Hex 10 is 16 in decimal."],
      ["Which IPv6 address is invalid?", "`2001:db8::1::5`", ["`2001:db8:a::12`", "`ff02::1:ff00:10`", "`fe80::202:b3ff:fe1e:8329`"], "`::` can appear only once, otherwise the length of each gap is unknown."],
      ["Under stateful DHCPv6, where does a host's default gateway come from?", "The Router Advertisement", ["The DHCPv6 server", "A static ARP entry", "The DNS server"], "In all three RA methods the gateway is the router's link-local address, taken from the RA."]
    ]},
    'chapter-10': { title: 'ICMP and connectivity testing', items: [
      ["Which messages does ping use?", "ICMP Echo Request and Echo Reply", ["TCP SYN and SYN-ACK", "ARP Request and ARP Reply", "UDP query and response"], "Ping tests one ICMP exchange and nothing more."],
      ["How does traceroute reveal each router on a path?", "It raises TTL and reads Time Exceeded replies", ["It records the route inside every reply", "It asks each router through DNS", "It floods the path with ARP requests"], "A probe with TTL n expires at hop n, which reveals that router."],
      ["Traceroute shows `* * *` on one hop, but later hops answer. What does it mean?", "That router gave no reply; forwarding works", ["The packets are stopped at that hop", "The link beyond that hop is down", "The destination refused the connection"], "Filtering or rate limits can hide a router while it forwards normally."],
      ["What does a successful ping to 127.0.0.1 prove?", "The local IP stack responds", ["The NIC and cable are working", "The default gateway is reachable", "The DNS server is configured"], "Loopback never reaches the NIC or the wire."],
      ["Ping by IP works but ping by hostname fails. What do you check first?", "The DNS resolver configuration", ["The cable and link lights", "The switch MAC table", "The default route on the router"], "IP reachability is proven, so the name resolution step is the missing piece."],
      ["Which port does ICMP use?", "None: it has no port numbers", ["UDP 7", "TCP 7", "UDP 161"], "ICMP is carried in IP and has types and codes, not ports."],
      ["What is a sensible order for testing connectivity?", "Loopback, gateway, remote IP, hostname, application", ["Application, hostname, remote IP, gateway, loopback", "Gateway, loopback, hostname, remote IP, application", "Hostname, loopback, remote IP, application, gateway"], "Each step adds one dependency, so the first failure points at the cause."],
      ["Why can blocking all ICMPv6 break an IPv6 network?", "Neighbor Discovery runs over ICMPv6", ["IPv6 uses ICMPv6 for encryption", "TCP segments are carried in ICMPv6", "DNS queries depend on ICMPv6 Echo"], "RS, RA, NS and NA are ICMPv6 messages. Packet Too Big is too."]
    ]},
    'chapter-11': { title: 'Transport layer: TCP and UDP', items: [
      ["A segment starts at sequence 7001 and carries 1200 bytes, all in order. What is the ACK?", "8201", ["8200", "7002", "1201"], "Bytes 7001 to 8200 arrived, so the next expected byte is 8201."],
      ["What is the three-way handshake order?", "SYN, SYN-ACK, ACK", ["SYN, ACK, FIN", "ACK, SYN, SYN-ACK", "FIN, ACK, SYN"], "Closing is the one that uses FIN and ACK in each direction."],
      ["A client's SYN has seq=1000. What ack does the server's SYN-ACK carry?", "1001", ["1000", "5001", "2000"], "SYN consumes one sequence number. The server's own seq is independent."],
      ["How large is the UDP header?", "8 bytes", ["4 bytes", "20 bytes", "40 bytes"], "Four 2-byte fields: source port, destination port, length, checksum."],
      ["A voice packet has 160 bytes of payload over IPv4 and UDP. How much is header?", "28 bytes, about 15%", ["40 bytes, about 20%", "8 bytes, about 5%", "28 bytes, about 18%"], "20 + 8 = 28, and 28 / 188 = 14.9%. Over TCP it would be 40 / 200 = 20%."],
      ["Which range is the well-known ports?", "0 to 1023", ["1024 to 49151", "49152 to 65535", "0 to 65535"], "Registered: 1024 to 49151. Dynamic: 49152 to 65535."],
      ["Which flag aborts a TCP connection immediately?", "RST", ["FIN", "PSH", "URG"], "FIN closes politely one direction at a time. RST resets the connection."],
      ["What protects the receiver from being overwhelmed?", "The receive window (flow control)", ["The congestion window at the sender", "The sequence number field", "The urgent pointer"], "Flow control protects the receiver. Congestion control responds to the network."],
      ["`netstat` shows thousands of SYN_RECEIVED entries. What does that suggest?", "A SYN flood attack", ["A normal browsing session", "A bug in a client application", "A server that is not listening"], "Half-open connections are piling up because final ACKs never arrive."],
      ["`netstat` shows many CLOSE_WAIT entries. What does that suggest?", "The application is not closing its sockets", ["The remote host is flooding the server", "The port is open and waiting", "The connection is fully established"], "The other side closed, but our application has not."],
      ["With an MTU of 1500 over IPv4 and no options, what is the usual TCP MSS?", "1460 bytes", ["1500 bytes", "1480 bytes", "1440 bytes"], "1500 - 20 IP - 20 TCP = 1460. Over IPv6 it is 1440."],
      ["Why does DHCP use UDP rather than TCP?", "The client has no IP yet, so no session is possible", ["UDP encrypts the address offers", "UDP guarantees the lease is delivered", "TCP has no port number for DHCP"], "A host without an address cannot complete a TCP handshake. DHCP broadcasts over UDP 67/68."]
    ]},
    'chapter-12': { title: 'Application layer protocols', items: [
      ["What is the correct DHCP order?", "Discover, Offer, Request, Acknowledge", ["Offer, Discover, Acknowledge, Request", "Request, Offer, Discover, Acknowledge", "Discover, Request, Offer, Acknowledge"], "DORA. The client finds servers, gets an offer, requests it, and the server confirms."],
      ["What source and destination does a new client use in DHCPDISCOVER?", "From 0.0.0.0 to 255.255.255.255", ["From 169.254.0.1 to 224.0.0.1", "From 127.0.0.1 to the gateway", "From 0.0.0.0 to the DNS server"], "It has no address and does not know the server, so it broadcasts."],
      ["Which DNS record does a mail server look up first for a recipient's domain?", "MX", ["A", "NS", "AAAA"], "MX names the domain's mail exchanger. An A or AAAA lookup follows for that server."],
      ["Which DNS record maps a name to an IPv6 address?", "AAAA", ["A", "CNAME", "PTR"], "A is IPv4, CNAME is an alias, PTR is reverse lookup."],
      ["A user wants the same folders and read status on phone and laptop. Which protocol?", "IMAP", ["POP3", "SMTP", "HTTP"], "IMAP keeps mail on the server. POP3 by default downloads and deletes."],
      ["Which protocol and port send mail between servers?", "SMTP, TCP 25", ["POP3, TCP 110", "IMAP, TCP 143", "SMTP, UDP 25"], "SMTP sends. POP3 and IMAP read."],
      ["Which FTP port carries commands?", "TCP 21", ["TCP 20", "UDP 69", "TCP 22"], "21 is control and 20 is data in active mode. UDP 69 is TFTP, and 22 is SSH."],
      ["Which protocol copies IOS images with no login, over UDP 69?", "TFTP", ["FTP", "SMB", "SSH"], "TFTP is simple: no login and no directory listing."],
      ["What does HTTP status 403 mean?", "Access is denied", ["Resource does not exist", "Resource has a new URL", "Server failed internally"], "404 is not found, 301 is moved, 500 is a server error."],
      ["Which HTTP method sends form data to a server?", "POST", ["GET", "DELETE", "HEAD"], "GET requests data, and POST submits it."],
      ["What does PAT let many inside hosts do?", "Share one public IP using different ports", ["Encrypt traffic to the public Internet", "Each hold a fixed public address", "Avoid needing a default gateway"], "PAT (NAT overload) tracks flows by translated port. It is not encryption."],
      ["Which is true of HTTPS compared with HTTP?", "Encrypted, port 443, server proven by certificate", ["Encrypted, port 80, no certificate is used", "Plain text, port 443, certificate optional", "Compressed only, port 8080, no identity check"], "TLS adds encryption, integrity and server authentication."],
      ["Which pair of addresses must never be leased to hosts?", "The network and the broadcast address", ["The first and last usable addresses", "The gateway and the first usable address", "Any two addresses ending in .0"], "They identify the subnet and all of its hosts. An address ending in .0 can be valid under shorter prefixes."],
      ["Who normally walks through the root, TLD and authoritative servers?", "The recursive resolver", ["The client's browser", "The default gateway", "The authoritative server"], "The client asks one resolver, which does the walking and caches the answer."],
      ["Which port does SMB use?", "TCP 445", ["TCP 443", "UDP 161", "TCP 143"], "SMB shares files and printers. 443 is HTTPS, 161 is SNMP, 143 is IMAP."]
    ]},
    'chapter-13': { title: 'Network and system security', items: [
      ["An attacker alters a record in transit. Which CIA goal is hit?", "Integrity", ["Confidentiality", "Availability", "Accounting"], "Confidentiality is about disclosure and availability about access."],
      ["How does a hash differ from encryption?", "A hash is one-way; encryption is reversible", ["A hash needs a key; encryption does not", "A hash hides data; encryption only signs it", "They are two names for one process"], "Encryption can be reversed with the right key. A digest is not designed to be reversed."],
      ["How do IDS and IPS differ?", "IDS alerts; IPS can block in-path", ["IDS blocks; IPS only alerts", "IDS is for wireless; IPS is for wired", "IDS encrypts; IPS authenticates"], "An IPS sits in the traffic path and can act on what it detects."],
      ["What happens at the end of a traditional IOS ACL?", "An implicit deny matches everything left", ["An implicit permit matches everything left", "The router asks the RADIUS server", "The packet is logged and forwarded"], "Unmatched traffic is denied, so required traffic must be permitted explicitly."],
      ["What is the wildcard mask for a /24?", "0.0.0.255", ["255.255.255.0", "0.0.255.255", "255.255.255.255"], "A wildcard inverts the subnet mask bits."],
      ["A fake AP imitates the campus SSID. What is that attack called?", "Evil twin", ["Tailgating", "SYN flood", "Honeypot"], "Enterprise authentication with server certificate validation is the defense."],
      ["What does WPA3-Personal use for authentication?", "SAE", ["WEP", "TKIP", "LEAP"], "WEP, TKIP and LEAP are obsolete."],
      ["What is the purpose of a DMZ?", "A controlled segment for public-facing services", ["A segment with all ports open to the world", "The VLAN that carries management traffic", "A backup link to the second ISP"], "A DMZ has explicit policy between external, DMZ and internal segments."],
      ["Someone follows an employee through a secure door. What is that?", "Tailgating", ["Phishing", "Spoofing", "Reconnaissance"], "A mantrap or access-control vestibule reduces it."],
      ["What separates a worm from a virus?", "A worm spreads by itself across networks", ["A worm must attach to a host file", "A worm only encrypts files for ransom", "A worm is always hidden in a useful app"], "A virus attaches to something and needs help to run. A Trojan is the one that disguises itself."],
      ["Which control directly addresses SQL injection?", "Parameterized queries", ["Output compression", "Client-side colors", "A longer session timeout"], "Parameters keep input as data rather than executable query text."],
      ["In 802.1X, what is the client device called?", "Supplicant", ["Authenticator", "Authentication server", "Controller"], "The AP or switch is the authenticator, and RADIUS is commonly the server."]
    ]},
    'chapter-14': { title: 'Resilience, backups, physical facilities, and specialized systems', items: [
      ["About how much downtime per year does 99.999% allow?", "5.26 minutes", ["52.6 minutes", "8.76 hours", "26 seconds"], "0.001% of a 365-day year is about 5.26 minutes."],
      ["Up to one hour of new data may be lost. Which objective is that?", "RPO of one hour", ["RTO of one hour", "MTU of one hour", "N+1 of one hour"], "RPO is acceptable data loss. RTO is how fast service must return."],
      ["Which RAID level has no redundancy at all?", "RAID 0", ["RAID 1", "RAID 5", "RAID 10"], "RAID 0 only stripes. One disk failure loses the array."],
      ["How many disk failures does a healthy RAID 5 tolerate?", "One", ["Zero", "Two", "Half of the disks"], "RAID 5 has single distributed parity. RAID 6 has dual parity."],
      ["Why is RAID not a backup?", "Deletion and malware affect the whole array", ["RAID stores data only in volatile RAM", "RAID disks cannot be read after a reboot", "RAID encrypts data without keeping keys"], "Backups are retained, independent copies. RAID protects against certain disk failures."],
      ["To restore from a differential scheme, what do you need?", "The last full plus the latest differential", ["The last full plus every differential", "Only the latest differential", "Every full backup ever taken"], "An incremental scheme is the one that needs the full plus each incremental."],
      ["What does HSRP protect?", "The default gateway for hosts", ["The MAC table of the access switch", "The DNS zone of the domain", "The DHCP lease database"], "Hosts use a virtual gateway address that survives a router failure."],
      ["What does a UPS provide?", "Temporary conditioned battery power", ["Long-term fuel-based generation", "Cooling for the server room", "Distribution of power to racks"], "A generator handles long outages. A PDU distributes power."],
      ["A reduced-voltage event is called:", "A brownout", ["A blackout", "A surge", "A spike"], "A blackout is total loss. Surges and spikes are increased voltage."],
      ["What is a honeypot?", "A monitored decoy that reveals attackers", ["A backup of the production database", "A firewall rule that blocks scanners", "A redundant link between two sites"], "It supports detection and learning, and must be isolated."]
    ]},
    'chapter-15': { title: 'Build and troubleshoot a small network', items: [
      ["Same-subnet pings work but remote ones fail. Where do you look first?", "Gateway, mask and routes", ["The cable to the local switch", "The MAC table aging timer", "The console password"], "Local traffic proves the link. The next dependency is leaving the subnet."],
      ["A host is 192.168.1.10/24 with gateway 192.168.2.1. What is wrong?", "The gateway is outside the host's subnet", ["The host address is reserved for broadcast", "The mask is too short for a private address", "Nothing: gateways are usually remote"], "A gateway must be directly reachable on the local subnet."],
      ["A router has two LANs on its own interfaces. Which routes are needed between them?", "None: both are connected routes", ["One static route for each LAN", "A default route on the router", "A dynamic routing protocol"], "Connected routes appear once the interfaces are up with addresses."],
      ["Which method starts at the physical layer and moves up?", "Bottom-up", ["Top-down", "Divide-and-conquer", "Follow-the-path"], "Top-down starts at the application. Divide-and-conquer starts in the middle."],
      ["An SVI stays down after `no shutdown`. What else must be true?", "The VLAN exists with an active port in it", ["The switch has a default route", "DHCP is enabled on the switch", "The console line has a password"], "An SVI needs its VLAN and usually at least one up/up port in that VLAN."],
      ["Which command shows what a Cisco device sees directly connected?", "`show cdp neighbors detail`", ["`show ip route`", "`show mac address-table`", "`show ipv6 neighbors`"], "CDP discovers directly attached Cisco devices at Layer 2."],
      ["Which issue causes unstable ARP mappings and intermittent failures?", "Duplicate IP addresses", ["A missing console password", "A saved startup configuration", "A long interface description"], "Two hosts answering for one IP makes the mapping flip between them."],
      ["IPv4 works but IPv6 fails. What is the most useful thing to check?", "IPv6 prefixes, RA, ND and IPv6 routing", ["The IPv4 default route on the host", "The ARP cache of the gateway", "The DHCPv4 pool on the router"], "A working IPv4 path proves nothing about IPv6, which is configured separately."]
    ]},
    'chapter-16': { title: 'Follow one complete packet journey', items: [
      ["In what order does a fresh laptop normally open an HTTPS page?", "DHCP, DNS, ARP for gateway, TCP, TLS, HTTP", ["DNS, DHCP, TCP, ARP, HTTP, TLS", "ARP, TCP, DHCP, DNS, TLS, HTTP", "DHCP, TCP, DNS, HTTP, ARP, TLS"], "Get configured, resolve the name, reach the next hop, open transport, secure it, then speak HTTP."],
      ["For a remote server, what is the destination MAC on the first frame?", "The gateway's LAN MAC", ["The server's MAC", "The switch's MAC", "The DNS server's MAC"], "Ethernet only reaches the next hop on this link."],
      ["With PAT at the edge, what does the server see as the source?", "The edge router's public IP and mapped port", ["The PC's private IP and original port", "The switch's management IP", "The ISP's DNS server address"], "PAT rewrites the source address and port at the boundary."],
      ["Which ports does the client's first TCP SYN to an HTTPS server use?", "An ephemeral source, destination 443", ["Source 443, destination ephemeral", "Source 80, destination 443", "Both ports set to 443"], "The client picks a temporary port. The server listens on 443."],
      ["Without NAT, what does a router leave unchanged on the IP packet?", "Source and destination IP addresses", ["The TTL value", "The header checksum", "The Ethernet MAC addresses"], "The TTL decrements and the IPv4 checksum is recalculated, and the frame is rebuilt."],
      ["What replaces ARP in the IPv6 version of this journey?", "Neighbor Discovery over ICMPv6", ["DHCPv6 relay messages", "AAAA lookups through DNS", "TLS certificate validation"], "ARP is IPv4-only. AAAA replaces A for the name lookup."],
      ["The DNS server is on another subnet. What does the host ARP for?", "Its default gateway", ["The DNS server", "The web server", "Nothing: DNS avoids ARP"], "Every remote destination still needs the local next hop first."]
    ]}
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = BANK;
  else root.QUIZ_BANK = BANK;
})(typeof self !== 'undefined' ? self : this);
