"use client";

import { useEffect, useRef } from "react";

/**
 * The five necklace lengths in the size guide diagram, drawn as springy
 * strings on desktop: move the cursor onto a chain and it catches, follows
 * the cursor a little, then snaps back with a small wobble once you pull
 * far enough away (or leave the diagram). Both ends stay pinned at the neck.
 *
 * Each chain is a run of cubic beziers in the diagram's viewBox units:
 * [x0, y0, then c1x, c1y, c2x, c2y, x, y per segment], 40cm ... 60cm,
 * the centrelines of the traced outlines from the design.
 */
const CHAINS: number[][] = [
  [
    864.3, 566.45, 867.4, 590.35, 876.55, 611.4, 892.35, 626.45, 908.2, 641.45,
    930.6, 650.5, 960.1, 650.5, 989.6, 650.5, 1012.05, 641.45, 1027.85, 626.45,
    1043.65, 611.4, 1052.85, 590.35, 1056, 566.45,
  ],
  [
    864.3, 566.4, 864.3, 596.95, 871.8, 625.1, 887.6, 645.7, 903.3, 666.2,
    927.25, 679.1, 960.1, 679.1, 992.95, 679.1, 1017.1, 666.3, 1033, 645.8,
    1048.8, 625.3, 1056.4, 597.15, 1056, 566.4,
  ],
  [
    864.3, 566.4, 864.3, 608.45, 872.2, 644.85, 888.1, 670.75, 904.05, 696.65,
    928, 712, 960.1, 712, 992.2, 712, 1016.15, 696.65, 1032.1, 670.75, 1048.1,
    644.85, 1056, 608.45, 1056, 566.4,
  ],
  [
    864.3, 566.4, 864.3, 623, 871.4, 670.3, 886.95, 703.4, 894.7, 719.95, 904.6,
    733, 916.7, 741.9, 928.9, 750.75, 943.3, 755.5, 960.1, 755.5, 977, 755.5,
    991.4, 750.75, 1003.5, 741.9, 1015.65, 733, 1025.55, 719.95, 1033.35, 703.4,
    1048.9, 670.3, 1056, 623, 1056, 566.4,
  ],
  [
    864.3, 566.4, 864.3, 626.25, 864.3, 682.85, 876.25, 724.45, 882.25, 745.3,
    891.25, 762.4, 904.7, 774.25, 918.2, 786.15, 936.2, 792.8, 960.1, 792.8,
    984.1, 792.8, 1002.05, 786.15, 1015.55, 774.25, 1029, 762.4, 1038, 745.3,
    1044, 724.45, 1056, 682.85, 1056, 626.25, 1056, 566.4,
  ],
];

/** Samples per chain when it's bent */
const SAMPLES = 96;
/** How close (viewBox units) the cursor must come to catch a chain */
const GRAB = 5;
/** How far the cursor can pull before the chain lets go */
const RELEASE = 34;
/** How much of the pull the chain follows (keeps it subtle) */
const FOLLOW = 0.55;
/** Spring back: stiffness and damping per frame */
const STIFFNESS = 0.16;
const DAMPING = 0.8;

type Point = { x: number; y: number };

type Chain = {
  rest: string;
  points: Point[];
  /** 0..1 along the chain, by length */
  t: number[];
  /** where along the chain it was caught (0..1) and its sample index */
  anchor: number;
  anchorIndex: number;
  offset: Point;
  velocity: Point;
  target: Point;
  grabbed: boolean;
  moving: boolean;
};

function restPath(c: number[]) {
  let d = `M ${c[0]} ${c[1]}`;
  for (let i = 2; i < c.length; i += 6) {
    d += ` C ${c.slice(i, i + 6).join(" ")}`;
  }
  return d;
}

function sample(c: number[]): { points: Point[]; t: number[] } {
  const segments = (c.length - 2) / 6;
  const perSegment = Math.ceil(SAMPLES / segments);
  const points: Point[] = [{ x: c[0], y: c[1] }];
  for (let s = 0; s < segments; s++) {
    const [x0, y0] = [c[s * 6], c[s * 6 + 1]];
    const [x1, y1, x2, y2, x3, y3] = c.slice(s * 6 + 2, s * 6 + 8);
    for (let k = 1; k <= perSegment; k++) {
      const u = k / perSegment;
      const v = 1 - u;
      const a = v * v * v;
      const b = 3 * v * v * u;
      const cc = 3 * v * u * u;
      const d = u * u * u;
      points.push({
        x: a * x0 + b * x1 + cc * x2 + d * x3,
        y: a * y0 + b * y1 + cc * y2 + d * y3,
      });
    }
  }
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(
      lengths[i - 1] +
        Math.hypot(
          points[i].x - points[i - 1].x,
          points[i].y - points[i - 1].y,
        ),
    );
  }
  const total = lengths[lengths.length - 1];
  return { points, t: lengths.map((l) => l / total) };
}

/** Plucked-string shape: 1 where it was caught, easing to 0 at both ends */
function weight(t: number, anchor: number) {
  if (t <= anchor) return Math.sin((Math.PI / 2) * (t / anchor));
  return Math.sin((Math.PI / 2) * ((1 - t) / (1 - anchor)));
}

export function ElasticChains() {
  const groupRef = useRef<SVGGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const group = groupRef.current;
    const svg = group?.ownerSVGElement;
    const area = svg?.parentElement;
    if (!group || !svg || !area) return;

    const canAnimate = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );

    const chains: Chain[] = CHAINS.map((c) => ({
      rest: restPath(c),
      ...sample(c),
      anchor: 0.5,
      anchorIndex: 0,
      offset: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      grabbed: false,
      moving: false,
    }));

    let frame = 0;

    const draw = (chain: Chain, i: number) => {
      const path = pathRefs.current[i];
      if (!path) return;
      if (!chain.moving) {
        path.setAttribute("d", chain.rest);
        return;
      }
      let d = "";
      chain.points.forEach((p, k) => {
        const w = weight(chain.t[k], chain.anchor);
        const x = p.x + chain.offset.x * w;
        const y = p.y + chain.offset.y * w;
        d += `${k ? " L" : "M"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      });
      path.setAttribute("d", d);
    };

    const tick = () => {
      frame = 0;
      let active = false;
      chains.forEach((chain, i) => {
        if (!chain.moving) return;
        if (chain.grabbed) {
          // Follow the cursor closely while caught
          chain.offset.x += (chain.target.x - chain.offset.x) * 0.3;
          chain.offset.y += (chain.target.y - chain.offset.y) * 0.3;
          chain.velocity.x = 0;
          chain.velocity.y = 0;
        } else {
          // Spring back to rest
          chain.velocity.x =
            (chain.velocity.x - chain.offset.x * STIFFNESS) * DAMPING;
          chain.velocity.y =
            (chain.velocity.y - chain.offset.y * STIFFNESS) * DAMPING;
          chain.offset.x += chain.velocity.x;
          chain.offset.y += chain.velocity.y;
          const settled =
            Math.abs(chain.offset.x) + Math.abs(chain.offset.y) < 0.02 &&
            Math.abs(chain.velocity.x) + Math.abs(chain.velocity.y) < 0.02;
          if (settled) {
            chain.offset = { x: 0, y: 0 };
            chain.moving = false;
          }
        }
        draw(chain, i);
        if (chain.moving) active = true;
      });
      if (active) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const release = (chain: Chain) => {
      chain.grabbed = false;
      chain.target = { x: 0, y: 0 };
      start();
    };

    const toSvg = (event: PointerEvent): Point | null => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        ctm.inverse(),
      );
      return { x: p.x, y: p.y };
    };

    const onMove = (event: PointerEvent) => {
      if (!canAnimate.matches || event.pointerType !== "mouse") return;
      const cursor = toSvg(event);
      if (!cursor) return;

      const held = chains.find((chain) => chain.grabbed);
      if (held) {
        const base = held.points[held.anchorIndex];
        const dx = cursor.x - base.x;
        const dy = cursor.y - base.y;
        if (Math.hypot(dx, dy) > RELEASE) {
          release(held);
        } else {
          held.target = { x: dx * FOLLOW, y: dy * FOLLOW };
          start();
        }
        return;
      }

      // Catch the nearest chain if the cursor is on it
      let chain: Chain | null = null;
      let k = 0;
      let nearest = GRAB;
      for (const c of chains) {
        for (let i = 0; i < c.points.length; i++) {
          const dist = Math.hypot(
            cursor.x - c.points[i].x,
            cursor.y - c.points[i].y,
          );
          if (dist < nearest) {
            nearest = dist;
            chain = c;
            k = i;
          }
        }
      }
      if (!chain) return;
      // Ignore the pinned ends at the neck
      const t = chain.t[k];
      if (t < 0.08 || t > 0.92) return;
      // Keep the current bend if it's still wobbling: re-anchor smoothly
      if (chain.moving) {
        const w = weight(t, chain.anchor);
        chain.offset = { x: chain.offset.x * w, y: chain.offset.y * w };
      }
      chain.anchor = t;
      chain.anchorIndex = k;
      chain.grabbed = true;
      chain.moving = true;
      chain.target = {
        x: (cursor.x - chain.points[k].x) * FOLLOW,
        y: (cursor.y - chain.points[k].y) * FOLLOW,
      };
      start();
    };

    const onLeave = () => chains.filter((c) => c.grabbed).forEach(release);

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <g ref={groupRef} fill="none" stroke="currentColor" strokeWidth={1}>
      {CHAINS.map((c, i) => (
        <path
          key={i}
          ref={(el) => {
            pathRefs.current[i] = el;
          }}
          d={restPath(c)}
        />
      ))}
    </g>
  );
}
