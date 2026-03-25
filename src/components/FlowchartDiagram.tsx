/**
 * FlowchartDiagram — renders proper flowchart shapes via SVG
 *
 * Node types:
 *   start / end  → oval/stadium
 *   process      → rectangle
 *   input        → parallelogram (lean right)  – Entrada de dados
 *   output       → rectangle with top-left corner cut – Saída de dados
 *   decision     → diamond
 *   connector    → small circle
 *
 * Accepts a JSON string in the `chart` prop:
 *   { "nodes": [...], "edges": [...] }
 */

const NW  = 160;   // node width
const NH  = 42;    // node height
const DW  = 140;   // decision diamond width (half)
const DH  = 36;    // decision diamond height (half)
const RY  = 90;    // row Y-step
const CX  = 240;   // center X of canvas
const LEAN = 16;   // parallelogram lean amount
const HCUT = 28;   // output shape: horizontal cut along top edge (from top-left corner)
const VCUT = 18;   // output shape: vertical cut along left edge (from top-left corner)
const FONT = 13;   // label font size

type NodeType = 'start' | 'end' | 'process' | 'input' | 'output' | 'decision' | 'connector';

interface FNode { id: string; type: NodeType; label: string }
interface FEdge { from: string; to: string; label?: string; back?: boolean }
interface FlowDef { nodes: FNode[]; edges: FEdge[] }

const COLORS: Record<NodeType, { fill: string; stroke: string }> = {
  start:     { fill: '#c8f7c5', stroke: '#27ae60' },
  end:       { fill: '#f7c5c5', stroke: '#e74c3c' },
  process:   { fill: '#d6eaf8', stroke: '#2980b9' },
  input:     { fill: '#fdebd0', stroke: '#e67e22' },
  output:    { fill: '#fdebd0', stroke: '#e67e22' },
  decision:  { fill: '#f9ebea', stroke: '#c0392b' },
  connector: { fill: '#e8daef', stroke: '#8e44ad' },
};

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  const charW = FONT * 0.55;
  const maxChars = Math.floor(maxWidth / charW);
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function NodeShape({ node, cx, cy }: { node: FNode; cx: number; cy: number }) {
  const { fill, stroke } = COLORS[node.type];
  const w = NW / 2;
  const h = NH / 2;

  let shape: React.ReactNode;

  if (node.type === 'start' || node.type === 'end') {
    shape = <ellipse cx={cx} cy={cy} rx={w} ry={h} fill={fill} stroke={stroke} strokeWidth={2} />;
  } else if (node.type === 'process') {
    shape = <rect x={cx - w} y={cy - h} width={NW} height={NH} fill={fill} stroke={stroke} strokeWidth={2} rx={2} />;
  } else if (node.type === 'input') {
    // Parallelogram lean-right
    const d = `M ${cx - w + LEAN},${cy - h} L ${cx + w},${cy - h} L ${cx + w - LEAN},${cy + h} L ${cx - w},${cy + h} Z`;
    shape = <path d={d} fill={fill} stroke={stroke} strokeWidth={2} />;
  } else if (node.type === 'output') {
    // Rectangle with top-left corner cut diagonally
    const d = `M ${cx - w + HCUT},${cy - h} L ${cx + w},${cy - h} L ${cx + w},${cy + h} L ${cx - w},${cy + h} L ${cx - w},${cy - h + VCUT} Z`;
    shape = <path d={d} fill={fill} stroke={stroke} strokeWidth={2} />;
  } else if (node.type === 'decision') {
    const d = `M ${cx},${cy - DH} L ${cx + DW},${cy} L ${cx},${cy + DH} L ${cx - DW},${cy} Z`;
    shape = <path d={d} fill={fill} stroke={stroke} strokeWidth={2} />;
  } else if (node.type === 'connector') {
    shape = <circle cx={cx} cy={cy} r={22} fill={fill} stroke={stroke} strokeWidth={2} />;
  }

  const nodeH = node.type === 'decision' ? DH : node.type === 'connector' ? 22 : h;
  const textWidth = node.type === 'decision' ? DW * 1.4 : NW - 12;
  const lines = wrapText(node.label, textWidth);
  const lineH = FONT + 3;
  const totalH = lines.length * lineH;
  const textY = cy - totalH / 2 + FONT / 2;

  return (
    <g>
      {shape}
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={textY + i * lineH}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={FONT}
          fontWeight={600}
          fill="#1a1a2e"
          fontFamily="sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({
  x1, y1, x2, y2, label, curved,
}: {
  x1: number; y1: number; x2: number; y2: number; label?: string; curved?: boolean;
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  let d: string;

  if (curved) {
    // Back-edge loop: go right first, then up
    const rx = Math.max(x1, x2) + 60;
    d = `M ${x1},${y1} L ${rx},${y1} L ${rx},${y2} L ${x2},${y2}`;
  } else if (x1 === x2) {
    d = `M ${x1},${y1} L ${x2},${y2}`;
  } else {
    d = `M ${x1},${y1} L ${x1},${midY} L ${x2},${midY} L ${x2},${y2}`;
  }

  return (
    <g>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#555" />
        </marker>
      </defs>
      <path d={d} stroke="#555" strokeWidth={1.8} fill="none" markerEnd="url(#arrowhead)" />
      {label && (
        <text
          x={curved ? Math.max(x1, x2) + 20 : midX + 6}
          y={curved ? (y1 + y2) / 2 : midY - 5}
          fontSize={11}
          fill="#c0392b"
          fontWeight={700}
          fontFamily="sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function FlowchartDiagram({ chart }: { chart: string }) {
  let def: FlowDef;
  try {
    def = JSON.parse(chart);
  } catch {
    return <div className="text-xs text-red-500 p-2">FlowchartDiagram: invalid JSON</div>;
  }

  const { nodes, edges } = def;

  // ── Auto-layout ────────────────────────────────────────────────────────────
  // 1. Compute depth of each node via BFS from root
  const inDeg: Record<string, number> = {};
  const outEdges: Record<string, FEdge[]> = {};
  const inEdges: Record<string, FEdge[]> = {};
  for (const n of nodes) { inDeg[n.id] = 0; outEdges[n.id] = []; inEdges[n.id] = []; }
  for (const e of edges) {
    if (!e.back) inDeg[e.to]++;
    outEdges[e.from].push(e);
    inEdges[e.to].push(e);
  }

  const depth: Record<string, number> = {};
  const queue = nodes.filter((n) => (inDeg[n.id] === 0) || edges.every(e => e.to !== n.id || e.back));
  if (queue.length === 0) queue.push(nodes[0]);
  for (const r of queue) depth[r.id] = 0;

  const visited = new Set<string>();
  const bfsQ = [...queue.map((n) => n.id)];
  while (bfsQ.length) {
    const cur = bfsQ.shift()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const e of outEdges[cur]) {
      if (e.back) continue;
      if (depth[e.to] === undefined || depth[e.to] < depth[cur] + 1) {
        depth[e.to] = depth[cur] + 1;
      }
      bfsQ.push(e.to);
    }
  }

  // Fill any missing depths
  for (const n of nodes) {
    if (depth[n.id] === undefined) depth[n.id] = 0;
  }

  // 2. Assign X positions: nodes at same depth share rows
  // Group by depth
  const byDepth: Record<number, string[]> = {};
  for (const n of nodes) {
    const d = depth[n.id];
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(n.id);
  }

  const pos: Record<string, { x: number; y: number }> = {};

  // For each depth level, distribute nodes horizontally
  // Determine if a node is in the "left branch" or "right branch" by tracing decisions
  // Simple heuristic: if there's a decision at a previous depth,
  // left outgoing edge (first 'yes'/'Sim') = left, right ('no'/'Não') = right

  // Find decision nodes and their branch assignments
  const branchX: Record<string, number> = {};
  for (const n of nodes) {
    if (n.type === 'decision') {
      const outs = outEdges[n.id].filter(e => !e.back);
      if (outs.length === 2) {
        // First edge = Sim/Yes = left branch, second = Não/No = right branch
        assignBranch(outs[0].to, CX - 120, depth[outs[0].to]);
        assignBranch(outs[1].to, CX + 120, depth[outs[1].to]);
      }
    }
  }

  function assignBranch(nodeId: string, x: number, startDepth: number) {
    branchX[nodeId] = x;
    const outs = outEdges[nodeId]?.filter(e => !e.back) ?? [];
    for (const e of outs) {
      const targetNode = nodes.find(n => n.id === e.to);
      if (!targetNode) continue;
      // If target is at higher depth and not already assigned by another decision
      if (depth[e.to] > startDepth && branchX[e.to] === undefined) {
        // Check if target has multiple incoming edges (merge point) → don't assign branch
        const targetIncoming = edges.filter(ed => ed.to === e.to && !ed.back);
        if (targetIncoming.length <= 1) {
          assignBranch(e.to, x, startDepth);
        }
      }
    }
  }

  // Now assign final positions
  const maxDepth = Math.max(...Object.values(depth));
  for (const n of nodes) {
    const x = branchX[n.id] ?? CX;
    const y = 50 + depth[n.id] * RY;
    pos[n.id] = { x, y };
  }

  // ── Canvas size ────────────────────────────────────────────────────────────
  const allX = Object.values(pos).map(p => p.x);
  const allY = Object.values(pos).map(p => p.y);
  const svgW = Math.max(...allX) + NW / 2 + 80;
  const svgH = Math.max(...allY) + NH + 60;

  // ── Edge connection points ─────────────────────────────────────────────────
  function getEdgePoints(e: FEdge) {
    const from = nodes.find(n => n.id === e.from)!;
    const to   = nodes.find(n => n.id === e.to)!;
    const fp = pos[e.from];
    const tp = pos[e.to];

    const fromH = from.type === 'decision' ? DH : from.type === 'connector' ? 22 : NH / 2;
    const toH   = to.type === 'decision'   ? DH : to.type === 'connector'   ? 22 : NH / 2;

    // For decision outgoing: exit from sides if branches go left/right
    let x1 = fp.x, y1 = fp.y + fromH;
    let x2 = tp.x, y2 = tp.y - toH;

    if (from.type === 'decision' && fp.x !== tp.x) {
      // Exit from diamond's left or right vertex
      x1 = tp.x < fp.x ? fp.x - DW : fp.x + DW;
      y1 = fp.y;
      y2 = tp.y - toH;
    }

    return { x1, y1, x2, y2 };
  }

  return (
    <div className="my-6 flex justify-center overflow-x-auto">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: '100%' }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#555" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => {
          const { x1, y1, x2, y2 } = getEdgePoints(e);
          return (
            <Arrow
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              label={e.label}
              curved={e.back}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <NodeShape key={n.id} node={n} cx={pos[n.id].x} cy={pos[n.id].y} />
        ))}
      </svg>
    </div>
  );
}
