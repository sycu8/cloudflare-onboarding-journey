import type { LocalizedString } from '../i18n/types';
import { productPages } from './productPages';

export type FlowNodeRole = 'client' | 'edge' | 'product' | 'origin' | 'storage' | 'drop';

export type FlowOutcome = 'allow' | 'block' | 'hit' | 'miss' | 'call';

export type ProductFlowNode = {
  id: string;
  label: LocalizedString;
  role: FlowNodeRole;
};

export type ProductFlowScene = {
  id: string;
  caption: LocalizedString;
  /** Ordered hops the packet visits (include return hops for hit/call). */
  hops: string[];
  outcome: FlowOutcome;
};

export type ProductFlowDef = {
  slug: string;
  title: LocalizedString;
  nodes: ProductFlowNode[];
  scenes: ProductFlowScene[];
};

const L = (vi: string, en: string): LocalizedString => ({ vi, en });

type NodeTuple = [id: string, label: LocalizedString, role: FlowNodeRole];

function nodesFrom(defs: NodeTuple[]): ProductFlowNode[] {
  return defs.map(([id, label, role]) => ({ id, label, role }));
}

function pathFlow(
  slug: string,
  title: LocalizedString,
  defs: NodeTuple[],
  hops: string[],
  caption: LocalizedString,
  outcome: FlowOutcome = 'allow',
): ProductFlowDef {
  return {
    slug,
    title,
    nodes: nodesFrom(defs),
    scenes: [{ id: 'main', caption, hops, outcome }],
  };
}

function mitigationFlow(
  slug: string,
  title: LocalizedString,
  defs: NodeTuple[],
  allowHops: string[],
  blockHops: string[],
  allowCaption: LocalizedString,
  blockCaption: LocalizedString,
): ProductFlowDef {
  return {
    slug,
    title,
    nodes: nodesFrom(defs),
    scenes: [
      { id: 'allow', caption: allowCaption, hops: allowHops, outcome: 'allow' },
      { id: 'block', caption: blockCaption, hops: blockHops, outcome: 'block' },
    ],
  };
}

function cacheFlow(
  slug: string,
  title: LocalizedString,
  edgeLabel: LocalizedString,
  hitCaption: LocalizedString,
  missCaption: LocalizedString,
): ProductFlowDef {
  return {
    slug,
    title,
    nodes: nodesFrom([
      ['user', L('User', 'User'), 'client'],
      ['edge', edgeLabel, 'edge'],
      ['origin', L('Origin', 'Origin'), 'origin'],
    ]),
    scenes: [
      {
        id: 'hit',
        caption: hitCaption,
        hops: ['user', 'edge', 'user'],
        outcome: 'hit',
      },
      {
        id: 'miss',
        caption: missCaption,
        hops: ['user', 'edge', 'origin', 'edge', 'user'],
        outcome: 'miss',
      },
    ],
  };
}

function callsFlow(
  slug: string,
  title: LocalizedString,
  defs: NodeTuple[],
  hops: string[],
  caption: LocalizedString,
): ProductFlowDef {
  return {
    slug,
    title,
    nodes: nodesFrom(defs),
    scenes: [{ id: 'call', caption, hops, outcome: 'call' }],
  };
}

/** Explicit flows for every product page slug. */
export const productFlows: ProductFlowDef[] = [
  // --- Foundations ---
  pathFlow(
    'dns',
    L('DNS resolve', 'DNS resolve'),
    [
      ['user', L('User', 'User'), 'client'],
      ['dns', L('DNS', 'DNS'), 'product'],
      ['ip', L('Địa chỉ IP', 'IP address'), 'origin'],
    ],
    ['user', 'dns', 'ip'],
    L('User hỏi tên miền → DNS trả IP → trình duyệt biết đi đâu.', 'User asks for a hostname → DNS returns an IP → the browser knows where to go.'),
  ),
  pathFlow(
    'proxy',
    L('Orange-cloud proxy', 'Orange-cloud proxy'),
    [
      ['user', L('User', 'User'), 'client'],
      ['proxy', L('Proxy (CF)', 'Proxy (CF)'), 'product'],
      ['origin', L('Origin', 'Origin'), 'origin'],
    ],
    ['user', 'proxy', 'origin'],
    L('Traffic đi qua proxy Cloudflare trước origin — tại đây mới có WAF/cache.', 'Traffic passes through Cloudflare’s proxy before origin — that is where WAF/cache apply.'),
  ),
  pathFlow(
    'edge',
    L('Edge gần user', 'Edge near the user'),
    [
      ['user', L('User', 'User'), 'client'],
      ['edge', L('Edge PoP', 'Edge PoP'), 'edge'],
      ['origin', L('Origin', 'Origin'), 'origin'],
    ],
    ['user', 'edge', 'origin'],
    L('Request vào PoP gần user trước, rồi mới tới origin nếu cần.', 'The request hits a nearby PoP first, then continues to origin only if needed.'),
  ),
  pathFlow(
    'origin',
    L('Tới origin', 'Reach origin'),
    [
      ['user', L('User', 'User'), 'client'],
      ['cf', L('Cloudflare', 'Cloudflare'), 'edge'],
      ['origin', L('Origin server', 'Origin server'), 'origin'],
    ],
    ['user', 'cf', 'origin'],
    L('Origin là máy chủ của bạn — Cloudflare đứng giữa để lọc và tăng tốc.', 'Origin is your server — Cloudflare sits in front to filter and accelerate.'),
  ),

  // --- Compute ---
  callsFlow(
    'workers',
    L('Worker gọi binding', 'Worker binding calls'),
    [
      ['client', L('Client', 'Client'), 'client'],
      ['worker', L('Worker', 'Worker'), 'product'],
      ['kv', L('KV', 'KV'), 'storage'],
      ['d1', L('D1', 'D1'), 'storage'],
    ],
    ['client', 'worker', 'kv', 'worker', 'd1', 'worker', 'client'],
    L('Client gọi Worker; Worker đọc KV/D1 qua binding rồi trả response.', 'Client calls a Worker; the Worker reads KV/D1 via bindings, then responds.'),
  ),
  callsFlow(
    'pages',
    L('Pages + Function', 'Pages + Function'),
    [
      ['user', L('User', 'User'), 'client'],
      ['pages', L('Pages', 'Pages'), 'edge'],
      ['fn', L('Pages Function', 'Pages Function'), 'product'],
      ['d1', L('D1', 'D1'), 'storage'],
    ],
    ['user', 'pages', 'fn', 'd1', 'fn', 'pages', 'user'],
    L('Frontend Pages gọi Function; Function truy vấn D1 rồi trả HTML/JSON.', 'Pages frontend calls a Function; the Function queries D1 and returns HTML/JSON.'),
  ),
  pathFlow(
    'containers',
    L('Container tại edge', 'Container at the edge'),
    [
      ['client', L('Client', 'Client'), 'client'],
      ['container', L('Container', 'Container'), 'product'],
      ['app', L('App process', 'App process'), 'origin'],
    ],
    ['client', 'container', 'app'],
    L('Request vào container chạy app của bạn gần user.', 'The request enters a container running your app close to the user.'),
  ),
  callsFlow(
    'durable-objects',
    L('Stateful Durable Object', 'Stateful Durable Object'),
    [
      ['client', L('Client', 'Client'), 'client'],
      ['worker', L('Worker', 'Worker'), 'edge'],
      ['do', L('Durable Object', 'Durable Object'), 'product'],
    ],
    ['client', 'worker', 'do', 'worker', 'client'],
    L('Worker forward tới một Durable Object giữ state nhất quán cho session/room.', 'The Worker forwards to a Durable Object that holds consistent state for a session/room.'),
  ),
  pathFlow(
    'queues',
    L('Hàng đợi async', 'Async queue'),
    [
      ['producer', L('Producer', 'Producer'), 'client'],
      ['queue', L('Queue', 'Queue'), 'product'],
      ['consumer', L('Consumer Worker', 'Consumer Worker'), 'origin'],
    ],
    ['producer', 'queue', 'consumer'],
    L('Producer đẩy message vào Queue; Consumer Worker xử lý sau, tách khỏi request nóng.', 'Producer enqueues a message; a Consumer Worker processes it later, off the hot path.'),
  ),
  pathFlow(
    'workflows',
    L('Workflow nhiều bước', 'Multi-step workflow'),
    [
      ['trigger', L('Trigger', 'Trigger'), 'client'],
      ['wf', L('Workflow', 'Workflow'), 'product'],
      ['step', L('Steps', 'Steps'), 'edge'],
      ['done', L('Done', 'Done'), 'origin'],
    ],
    ['trigger', 'wf', 'step', 'done'],
    L('Trigger khởi chạy Workflow; các bước chạy tuần tự/retry tới khi xong.', 'A trigger starts a Workflow; steps run (with retries) until completion.'),
  ),
  callsFlow(
    'browser-rendering',
    L('Render bằng browser', 'Browser rendering'),
    [
      ['worker', L('Worker', 'Worker'), 'client'],
      ['br', L('Browser Rendering', 'Browser Rendering'), 'product'],
      ['html', L('HTML/PDF', 'HTML/PDF'), 'storage'],
    ],
    ['worker', 'br', 'html', 'br', 'worker'],
    L('Worker nhờ Browser Rendering mở trang/in PDF rồi lấy kết quả về.', 'A Worker asks Browser Rendering to open a page or print a PDF, then receives the result.'),
  ),
  pathFlow(
    'workers-for-platforms',
    L('Platform → user Worker', 'Platform → user Worker'),
    [
      ['customer', L('Customer', 'Customer'), 'client'],
      ['platform', L('Platform Worker', 'Platform Worker'), 'edge'],
      ['userw', L('User Worker', 'User Worker'), 'product'],
    ],
    ['customer', 'platform', 'userw'],
    L('Platform nhận request rồi dispatch sang Worker của từng khách hàng.', 'The platform accepts the request, then dispatches to each customer’s Worker.'),
  ),

  // --- AI ---
  callsFlow(
    'workers-ai',
    L('Inference tại edge', 'Inference at the edge'),
    [
      ['app', L('App', 'App'), 'client'],
      ['wai', L('Workers AI', 'Workers AI'), 'product'],
      ['model', L('Model', 'Model'), 'storage'],
    ],
    ['app', 'wai', 'model', 'wai', 'app'],
    L('App gọi Workers AI; model chạy trên mạng Cloudflare và trả kết quả.', 'The app calls Workers AI; the model runs on Cloudflare’s network and returns a result.'),
  ),
  callsFlow(
    'ai-gateway',
    L('AI Gateway proxy', 'AI Gateway proxy'),
    [
      ['app', L('App', 'App'), 'client'],
      ['gw', L('AI Gateway', 'AI Gateway'), 'product'],
      ['provider', L('Model provider', 'Model provider'), 'origin'],
    ],
    ['app', 'gw', 'provider', 'gw', 'app'],
    L('App gọi qua AI Gateway — log, cache, limit — rồi tới provider.', 'The app calls through AI Gateway — logs, cache, limits — then to the provider.'),
  ),
  callsFlow(
    'agents',
    L('Agent gọi tool', 'Agent tool calls'),
    [
      ['user', L('User', 'User'), 'client'],
      ['agent', L('Agent', 'Agent'), 'product'],
      ['tool', L('Tools / AI', 'Tools / AI'), 'storage'],
    ],
    ['user', 'agent', 'tool', 'agent', 'user'],
    L('User nói với Agent; Agent gọi tool/model rồi trả lời.', 'The user talks to an Agent; the Agent calls tools/models, then replies.'),
  ),
  callsFlow(
    'vectorize',
    L('Truy vấn vector', 'Vector query'),
    [
      ['app', L('App', 'App'), 'client'],
      ['vec', L('Vectorize', 'Vectorize'), 'product'],
      ['idx', L('Index', 'Index'), 'storage'],
    ],
    ['app', 'vec', 'idx', 'vec', 'app'],
    L('App gửi embedding → Vectorize tìm gần nhất trong index.', 'The app sends an embedding → Vectorize finds nearest neighbors in the index.'),
  ),
  callsFlow(
    'ai-search',
    L('AI Search RAG', 'AI Search RAG'),
    [
      ['user', L('User', 'User'), 'client'],
      ['search', L('AI Search', 'AI Search'), 'product'],
      ['docs', L('Docs index', 'Docs index'), 'storage'],
    ],
    ['user', 'search', 'docs', 'search', 'user'],
    L('Câu hỏi → AI Search lấy đoạn tài liệu liên quan → trả câu trả lời.', 'A question → AI Search retrieves related docs → returns an answer.'),
  ),
  callsFlow(
    'sandbox',
    L('Chạy code trong sandbox', 'Run code in a sandbox'),
    [
      ['app', L('App', 'App'), 'client'],
      ['sb', L('Sandbox', 'Sandbox'), 'product'],
      ['code', L('Code exec', 'Code exec'), 'storage'],
    ],
    ['app', 'sb', 'code', 'sb', 'app'],
    L('App gửi code vào Sandbox; chạy cô lập rồi trả output.', 'The app sends code into a Sandbox; it runs isolated and returns output.'),
  ),

  // --- Storage ---
  callsFlow(
    'r2',
    L('Đọc/ghi object R2', 'Read/write R2 objects'),
    [
      ['worker', L('Worker', 'Worker'), 'client'],
      ['r2', L('R2', 'R2'), 'product'],
    ],
    ['worker', 'r2', 'worker'],
    L('Worker put/get object trên R2 qua binding — không phí egress kiểu cổ điển.', 'A Worker puts/gets objects on R2 via a binding — without classic egress fees.'),
  ),
  callsFlow(
    'd1',
    L('SQL trên D1', 'SQL on D1'),
    [
      ['worker', L('Worker', 'Worker'), 'client'],
      ['d1', L('D1', 'D1'), 'product'],
    ],
    ['worker', 'd1', 'worker'],
    L('Worker chạy SQL trên D1 và nhận rows về trong cùng request.', 'A Worker runs SQL on D1 and gets rows back in the same request.'),
  ),
  callsFlow(
    'kv',
    L('Đọc KV key', 'Read a KV key'),
    [
      ['worker', L('Worker', 'Worker'), 'client'],
      ['kv', L('KV', 'KV'), 'product'],
    ],
    ['worker', 'kv', 'worker'],
    L('Worker đọc/ghi key-value toàn cầu — phù hợp config và session nhẹ.', 'A Worker reads/writes a global key-value — great for config and light session data.'),
  ),
  pathFlow(
    'hyperdrive',
    L('Hyperdrive tới DB', 'Hyperdrive to DB'),
    [
      ['worker', L('Worker', 'Worker'), 'client'],
      ['hd', L('Hyperdrive', 'Hyperdrive'), 'product'],
      ['db', L('Database', 'Database'), 'origin'],
    ],
    ['worker', 'hd', 'db'],
    L('Worker kết nối DB qua Hyperdrive — pool/cache làm giảm latency.', 'The Worker reaches the DB through Hyperdrive — pooling/caching cuts latency.'),
  ),
  pathFlow(
    'pipelines',
    L('Ingest → pipeline', 'Ingest → pipeline'),
    [
      ['events', L('Events', 'Events'), 'client'],
      ['pipe', L('Pipelines', 'Pipelines'), 'product'],
      ['store', L('R2 / SQL', 'R2 / SQL'), 'storage'],
    ],
    ['events', 'pipe', 'store'],
    L('Stream sự kiện vào Pipelines rồi đổ xuống R2/SQL để phân tích.', 'Events stream into Pipelines, then land in R2/SQL for analysis.'),
  ),

  // --- Media ---
  cacheFlow(
    'images',
    L('Tối ưu ảnh', 'Image optimization'),
    L('Images', 'Images'),
    L('HIT: edge trả ảnh đã resize gần user — không đụng origin.', 'HIT: the edge serves a resized image near the user — origin stays quiet.'),
    L('MISS: lấy bản gốc từ origin/R2, biến đổi, cache rồi trả.', 'MISS: fetch original from origin/R2, transform, cache, then serve.'),
  ),
  pathFlow(
    'stream',
    L('Phát video Stream', 'Stream video delivery'),
    [
      ['user', L('Viewer', 'Viewer'), 'client'],
      ['stream', L('Stream', 'Stream'), 'product'],
      ['video', L('Encoded video', 'Encoded video'), 'storage'],
    ],
    ['user', 'stream', 'video'],
    L('Viewer xin playback; Stream phục vụ bản encode phù hợp từ edge.', 'The viewer requests playback; Stream serves a suitable encode from the edge.'),
  ),
  pathFlow(
    'realtime',
    L('Realtime media path', 'Realtime media path'),
    [
      ['peerA', L('Peer A', 'Peer A'), 'client'],
      ['rt', L('Realtime', 'Realtime'), 'product'],
      ['peerB', L('Peer B', 'Peer B'), 'origin'],
    ],
    ['peerA', 'rt', 'peerB'],
    L('Media/data đi Peer A → Realtime → Peer B với độ trễ thấp.', 'Media/data flows Peer A → Realtime → Peer B with low latency.'),
  ),

  // --- App security ---
  mitigationFlow(
    'waf',
    L('WAF kiểm tra request', 'WAF inspects the request'),
    [
      ['user', L('User', 'User'), 'client'],
      ['edge', L('Edge', 'Edge'), 'edge'],
      ['waf', L('WAF', 'WAF'), 'product'],
      ['origin', L('Origin', 'Origin'), 'origin'],
      ['drop', L('Block', 'Block'), 'drop'],
    ],
    ['user', 'edge', 'waf', 'origin'],
    ['user', 'edge', 'waf', 'drop'],
    L('Request sạch: WAF cho phép → tới origin.', 'Clean request: WAF allows it → continues to origin.'),
    L('Request độc hại khớp rule: WAF chặn tại edge.', 'Malicious request matches a rule: WAF blocks it at the edge.'),
  ),
  mitigationFlow(
    'ddos',
    L('Hấp thụ DDoS', 'Absorb a DDoS'),
    [
      ['attack', L('Attack flood', 'Attack flood'), 'client'],
      ['edge', L('CF network', 'CF network'), 'edge'],
      ['ddos', L('DDoS mitigation', 'DDoS mitigation'), 'product'],
      ['origin', L('Origin', 'Origin'), 'origin'],
      ['drop', L('Drop', 'Drop'), 'drop'],
    ],
    ['attack', 'edge', 'ddos', 'origin'],
    ['attack', 'edge', 'ddos', 'drop'],
    L('Traffic hợp lệ vẫn tới origin sau lớp mitigation.', 'Legitimate traffic still reaches origin after mitigation.'),
    L('Lưu lượng tấn công bị hấp thụ/drop trên mạng Cloudflare.', 'Attack volume is absorbed/dropped on Cloudflare’s network.'),
  ),
  pathFlow(
    'ssl',
    L('TLS tại edge', 'TLS at the edge'),
    [
      ['user', L('User', 'User'), 'client'],
      ['ssl', L('SSL/TLS', 'SSL/TLS'), 'product'],
      ['origin', L('Origin', 'Origin'), 'origin'],
    ],
    ['user', 'ssl', 'origin'],
    L('HTTPS kết thúc (hoặc được xử lý) tại Cloudflare trước khi tới origin.', 'HTTPS is terminated (or handled) at Cloudflare before reaching origin.'),
  ),
  mitigationFlow(
    'bots',
    L('Bot Management', 'Bot Management'),
    [
      ['client', L('Client', 'Client'), 'client'],
      ['bots', L('Bot score', 'Bot score'), 'product'],
      ['origin', L('Origin', 'Origin'), 'origin'],
      ['drop', L('Challenge/Block', 'Challenge/Block'), 'drop'],
    ],
    ['client', 'bots', 'origin'],
    ['client', 'bots', 'drop'],
    L('Client người thật (score tốt) được vào app.', 'A human client (good score) reaches the app.'),
    L('Bot đáng ngờ bị challenge hoặc block.', 'A suspicious bot is challenged or blocked.'),
  ),
  mitigationFlow(
    'api-shield',
    L('API Shield', 'API Shield'),
    [
      ['client', L('API client', 'API client'), 'client'],
      ['shield', L('API Shield', 'API Shield'), 'product'],
      ['api', L('API origin', 'API origin'), 'origin'],
      ['drop', L('Reject', 'Reject'), 'drop'],
    ],
    ['client', 'shield', 'api'],
    ['client', 'shield', 'drop'],
    L('Request đúng schema/auth → vào API.', 'Valid schema/auth request → reaches the API.'),
    L('Request lệch schema hoặc mTLS fail → bị từ chối.', 'Schema mismatch or mTLS failure → rejected.'),
  ),
  pathFlow(
    'page-shield',
    L('Theo dõi script trang', 'Watch page scripts'),
    [
      ['user', L('Browser', 'Browser'), 'client'],
      ['page', L('Page', 'Page'), 'edge'],
      ['ps', L('Page Shield', 'Page Shield'), 'product'],
    ],
    ['user', 'page', 'ps'],
    L('Browser tải trang; Page Shield quan sát script/third-party để phát hiện đổi bất thường.', 'The browser loads the page; Page Shield watches scripts/third parties for unexpected changes.'),
  ),
  mitigationFlow(
    'turnstile',
    L('Turnstile challenge', 'Turnstile challenge'),
    [
      ['user', L('User', 'User'), 'client'],
      ['ts', L('Turnstile', 'Turnstile'), 'product'],
      ['form', L('Form / API', 'Form / API'), 'origin'],
      ['drop', L('Reject', 'Reject'), 'drop'],
    ],
    ['user', 'ts', 'form'],
    ['user', 'ts', 'drop'],
    L('Token Turnstile hợp lệ → form/API nhận request.', 'Valid Turnstile token → the form/API accepts the request.'),
    L('Không có token / bot → request bị từ chối.', 'Missing token / bot → the request is rejected.'),
  ),
  mitigationFlow(
    'rate-limiting',
    L('Rate limiting', 'Rate limiting'),
    [
      ['client', L('Client', 'Client'), 'client'],
      ['rl', L('Rate limit', 'Rate limit'), 'product'],
      ['origin', L('Origin', 'Origin'), 'origin'],
      ['drop', L('429', '429'), 'drop'],
    ],
    ['client', 'rl', 'origin'],
    ['client', 'rl', 'drop'],
    L('Trong ngưỡng cho phép → request tới origin.', 'Within the allowed rate → request reaches origin.'),
    L('Vượt ngưỡng → trả 429 / block tại edge.', 'Over the limit → 429 / drop at the edge.'),
  ),
  mitigationFlow(
    'api-security',
    L('API security stack', 'API security stack'),
    [
      ['client', L('API client', 'API client'), 'client'],
      ['sec', L('API controls', 'API controls'), 'product'],
      ['api', L('API', 'API'), 'origin'],
      ['drop', L('Block', 'Block'), 'drop'],
    ],
    ['client', 'sec', 'api'],
    ['client', 'sec', 'drop'],
    L('Auth + rate limit + schema OK → vào API.', 'Auth + rate limit + schema OK → reaches the API.'),
    L('Lớp bảo vệ API chặn abuse trước origin.', 'API protections block abuse before origin.'),
  ),

  // --- Cloudflare One ---
  mitigationFlow(
    'access',
    L('Access policy', 'Access policy'),
    [
      ['user', L('User', 'User'), 'client'],
      ['access', L('Access', 'Access'), 'product'],
      ['app', L('App', 'App'), 'origin'],
      ['drop', L('Deny', 'Deny'), 'drop'],
    ],
    ['user', 'access', 'app'],
    ['user', 'access', 'drop'],
    L('Identity/device đạt policy → vào app.', 'Identity/device meets policy → reach the app.'),
    L('Không đạt policy → Access deny.', 'Policy fails → Access denies.'),
  ),
  pathFlow(
    'tunnel',
    L('Tunnel vào app riêng', 'Tunnel to a private app'),
    [
      ['user', L('User', 'User'), 'client'],
      ['cf', L('Cloudflare', 'Cloudflare'), 'edge'],
      ['tunnel', L('Tunnel', 'Tunnel'), 'product'],
      ['app', L('Private app', 'Private app'), 'origin'],
    ],
    ['user', 'cf', 'tunnel', 'app'],
    L('User tới Cloudflare; Tunnel nối outbound tới app nội bộ — không mở port public.', 'User hits Cloudflare; a Tunnel connects outbound to the private app — no public inbound ports.'),
  ),
  mitigationFlow(
    'gateway',
    L('Gateway SWG', 'Gateway SWG'),
    [
      ['device', L('Device', 'Device'), 'client'],
      ['gw', L('Gateway', 'Gateway'), 'product'],
      ['web', L('Internet / SaaS', 'Internet / SaaS'), 'origin'],
      ['drop', L('Block', 'Block'), 'drop'],
    ],
    ['device', 'gw', 'web'],
    ['device', 'gw', 'drop'],
    L('Policy cho phép → user ra Internet/SaaS.', 'Policy allows → user reaches Internet/SaaS.'),
    L('DNS/HTTP policy chặn destination rủi ro.', 'DNS/HTTP policy blocks risky destinations.'),
  ),
  pathFlow(
    'browser-isolation',
    L('Remote Browser Isolation', 'Remote Browser Isolation'),
    [
      ['user', L('User', 'User'), 'client'],
      ['rbi', L('RBI', 'RBI'), 'product'],
      ['web', L('Web page', 'Web page'), 'origin'],
    ],
    ['user', 'rbi', 'web'],
    L('Trang chạy trong browser remote; user chỉ nhận pixel/stream an toàn.', 'The page runs in a remote browser; the user only receives a safe pixel/stream.'),
  ),
  pathFlow(
    'warp',
    L('WARP client path', 'WARP client path'),
    [
      ['device', L('Device', 'Device'), 'client'],
      ['warp', L('WARP', 'WARP'), 'product'],
      ['cf', L('CF network', 'CF network'), 'edge'],
      ['dest', L('Destination', 'Destination'), 'origin'],
    ],
    ['device', 'warp', 'cf', 'dest'],
    L('Device qua WARP vào mạng Cloudflare rồi tới đích theo Zero Trust policy.', 'The device goes through WARP into Cloudflare’s network, then to the destination per Zero Trust policy.'),
  ),
  pathFlow(
    'casb',
    L('CASB quét SaaS', 'CASB scans SaaS'),
    [
      ['admin', L('Admin', 'Admin'), 'client'],
      ['casb', L('CASB', 'CASB'), 'product'],
      ['saas', L('SaaS', 'SaaS'), 'origin'],
    ],
    ['admin', 'casb', 'saas'],
    L('CASB kết nối SaaS để phát hiện misconfig, file rủi ro, shadow IT.', 'CASB connects to SaaS to find misconfigurations, risky files, and shadow IT.'),
  ),
  mitigationFlow(
    'dlp',
    L('DLP kiểm soát dữ liệu', 'DLP controls data'),
    [
      ['user', L('User', 'User'), 'client'],
      ['dlp', L('DLP', 'DLP'), 'product'],
      ['dest', L('Web / SaaS', 'Web / SaaS'), 'origin'],
      ['drop', L('Block', 'Block'), 'drop'],
    ],
    ['user', 'dlp', 'dest'],
    ['user', 'dlp', 'drop'],
    L('Nội dung không nhạy cảm → cho đi tiếp.', 'Non-sensitive content → allowed through.'),
    L('Phát hiện dữ liệu nhạy cảm → block hoặc đỏact.', 'Sensitive data detected → block or redact.'),
  ),
  pathFlow(
    'zero-trust',
    L('Verify rồi mới vào', 'Verify, then enter'),
    [
      ['user', L('User', 'User'), 'client'],
      ['zt', L('Zero Trust', 'Zero Trust'), 'product'],
      ['app', L('App / Internet', 'App / Internet'), 'origin'],
    ],
    ['user', 'zt', 'app'],
    L('Mỗi phiên được xác minh identity + device + policy trước khi vào tài nguyên.', 'Every session verifies identity + device + policy before reaching resources.'),
  ),
  pathFlow(
    'ztna',
    L('ZTNA thay VPN', 'ZTNA instead of VPN'),
    [
      ['user', L('User', 'User'), 'client'],
      ['ztna', L('ZTNA / Access', 'ZTNA / Access'), 'product'],
      ['app', L('Private app', 'Private app'), 'origin'],
    ],
    ['user', 'ztna', 'app'],
    L('User chỉ được vào đúng app theo policy — không mở cả mạng như VPN cổ điển.', 'The user reaches only the allowed app per policy — not the whole network like classic VPN.'),
  ),
  mitigationFlow(
    'swg',
    L('Secure Web Gateway', 'Secure Web Gateway'),
    [
      ['user', L('User', 'User'), 'client'],
      ['swg', L('SWG', 'SWG'), 'product'],
      ['web', L('Website', 'Website'), 'origin'],
      ['drop', L('Block', 'Block'), 'drop'],
    ],
    ['user', 'swg', 'web'],
    ['user', 'swg', 'drop'],
    L('Site hợp lệ → user duyệt bình thường.', 'Allowed site → user browses normally.'),
    L('Malware / category bị cấm → SWG chặn.', 'Malware / blocked category → SWG stops it.'),
  ),
  pathFlow(
    'sase',
    L('SASE một đường vào', 'SASE one on-ramp'),
    [
      ['user', L('User', 'User'), 'client'],
      ['sase', L('SASE stack', 'SASE stack'), 'product'],
      ['dest', L('App / Data', 'App / Data'), 'origin'],
    ],
    ['user', 'sase', 'dest'],
    L('Networking + Zero Trust gặp nhau: user vào một edge, policy áp mọi đích.', 'Networking + Zero Trust meet: one edge on-ramp, policies for every destination.'),
  ),
  pathFlow(
    'cloudflare-wan',
    L('Magic WAN site-to-site', 'Magic WAN site-to-site'),
    [
      ['siteA', L('Site A', 'Site A'), 'client'],
      ['wan', L('Cloudflare WAN', 'Cloudflare WAN'), 'product'],
      ['siteB', L('Site B', 'Site B'), 'origin'],
    ],
    ['siteA', 'wan', 'siteB'],
    L('Site A nối Site B qua mạng Cloudflare thay cho MPLS thuần.', 'Site A reaches Site B over Cloudflare’s network instead of legacy MPLS alone.'),
  ),

  // --- Delivery ---
  cacheFlow(
    'cache',
    L('Cache HIT / MISS', 'Cache HIT / MISS'),
    L('Cache', 'Cache'),
    L('HIT: edge có bản cache — trả ngay, origin nghỉ.', 'HIT: edge has a cached copy — serve immediately, origin rests.'),
    L('MISS: edge lấy từ origin, lưu cache, rồi trả user.', 'MISS: edge fetches from origin, stores cache, then serves the user.'),
  ),
  cacheFlow(
    'cdn',
    L('CDN HIT / MISS', 'CDN HIT / MISS'),
    L('CDN edge', 'CDN edge'),
    L('HIT: nội dung phục vụ từ PoP gần user.', 'HIT: content is served from a PoP near the user.'),
    L('MISS: PoP lấy từ origin (hoặc upper tier), cache, rồi trả.', 'MISS: PoP fetches from origin (or an upper tier), caches, then serves.'),
  ),
  pathFlow(
    'speed',
    L('Tối ưu tốc độ', 'Speed optimizations'),
    [
      ['user', L('User', 'User'), 'client'],
      ['speed', L('Speed / Argo', 'Speed / Argo'), 'product'],
      ['origin', L('Origin', 'Origin'), 'origin'],
    ],
    ['user', 'speed', 'origin'],
    L('Request đi đường tối ưu (smart routing, early hints, …) tới origin/asset.', 'The request takes an optimized path (smart routing, early hints, …) to origin/assets.'),
  ),
  pathFlow(
    'load-balancing',
    L('Load Balancing', 'Load Balancing'),
    [
      ['user', L('User', 'User'), 'client'],
      ['lb', L('Load Balancer', 'Load Balancer'), 'product'],
      ['o1', L('Origin A', 'Origin A'), 'origin'],
      ['o2', L('Origin B', 'Origin B'), 'origin'],
    ],
    ['user', 'lb', 'o1'],
    L('LB chọn origin khỏe mạnh (A/B) theo health check và pool.', 'The LB picks a healthy origin (A/B) using health checks and pools.'),
  ),

  pathFlow(
    'zaraz',
    L('Zaraz third-party', 'Zaraz third-party'),
    [
      ['page', L('Page', 'Page'), 'client'],
      ['zaraz', L('Zaraz', 'Zaraz'), 'product'],
      ['vendor', L('Vendor tags', 'Vendor tags'), 'origin'],
    ],
    ['page', 'zaraz', 'vendor'],
    L('Tag chạy phía server qua Zaraz — giảm JS nặng trên browser.', 'Tags run server-side via Zaraz — less heavy JS in the browser.'),
  ),
  pathFlow(
    'web-analytics',
    L('Beacon analytics', 'Beacon analytics'),
    [
      ['page', L('Page', 'Page'), 'client'],
      ['beacon', L('Beacon', 'Beacon'), 'edge'],
      ['wa', L('Web Analytics', 'Web Analytics'), 'product'],
    ],
    ['page', 'beacon', 'wa'],
    L('Trang gửi beacon nhẹ tới Web Analytics — đo traffic/perf không script nặng.', 'The page sends a light beacon to Web Analytics — traffic/perf without heavy scripts.'),
  ),
];

// Enrich load-balancing with a second origin scene (A/B).
const lb = productFlows.find((f) => f.slug === 'load-balancing');
if (lb) {
  lb.scenes = [
    {
      id: 'origin-a',
      caption: L('Health OK: LB đưa user tới Origin A.', 'Healthy: LB sends the user to Origin A.'),
      hops: ['user', 'lb', 'o1'],
      outcome: 'allow',
    },
    {
      id: 'origin-b',
      caption: L('Origin A lỗi: LB failover sang Origin B.', 'Origin A fails: LB failovers to Origin B.'),
      hops: ['user', 'lb', 'o2'],
      outcome: 'miss',
    },
  ];
}

const flowBySlug = new Map(productFlows.map((f) => [f.slug, f]));

export function getProductFlow(slug: string): ProductFlowDef | undefined {
  return flowBySlug.get(slug);
}

/** Returns product slugs that are missing a flow definition. */
export function assertAllProductsHaveFlows(): string[] {
  return productPages.map((p) => p.slug).filter((slug) => !flowBySlug.has(slug));
}
