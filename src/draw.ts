// MIT License

import { b2AABB, b2Color, b2Draw, b2Transform, b2Vec2, b2_pi } from "@flyover/box2d";

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// This class implements debug drawing callbacks that are invoked
// inside b2World::Step.
export class DebugDraw extends b2Draw {

    public static EXTENT = 100;

    public m_ctx: CanvasRenderingContext2D | null = null;

    constructor() {
        super();
    }

    public PushTransform(xf: b2Transform): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.save();
            ctx.translate(xf.p.x, xf.p.y);
            ctx.rotate(xf.q.GetAngle());
        }
    }

    public PopTransform(xf: b2Transform): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.restore();
        }
    }

    public DrawPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i: number = 1; i < vertexCount; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }

    public DrawSolidPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i: number = 1; i < vertexCount; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
            ctx.fillStyle = color.MakeStyleString(0.5);
            ctx.fill();
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }

    public DrawCircle(center: b2Vec2, radius: number, color: b2Color): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, b2_pi * 2, true);
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }

    public DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            const cx: number = center.x;
            const cy: number = center.y;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, b2_pi * 2, true);
            ctx.moveTo(cx, cy);
            ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
            ctx.fillStyle = color.MakeStyleString(0.5);
            ctx.fill();
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }

    // #if B2_ENABLE_PARTICLE
    public DrawParticles(centers: b2Vec2[], radius: number, colors: b2Color[] | null, count: number) {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            if (colors !== null) {
                for (let i = 0; i < count; ++i) {
                    const center = centers[i];
                    const color = colors[i];
                    ctx.fillStyle = color.MakeStyleString();
                    // ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                    ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, b2_pi * 2, true); ctx.fill();
                }
            } else {
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                // ctx.beginPath();
                for (let i = 0; i < count; ++i) {
                    const center = centers[i];
                    // ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                    ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, b2_pi * 2, true); ctx.fill();
                }
                // ctx.fill();
            }
        }
    }
    // #endif

    public DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = color.MakeStyleString(1);
            ctx.stroke();
        }
    }

    public DrawTransform(xf: b2Transform): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            this.PushTransform(xf);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(1, 0);
            ctx.strokeStyle = b2Color.RED.MakeStyleString(1);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 1);
            ctx.strokeStyle = b2Color.GREEN.MakeStyleString(1);
            ctx.stroke();

            this.PopTransform(xf);
        }
    }

    public DrawPoint(p: b2Vec2, size: number, color: b2Color): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.fillStyle = color.MakeStyleString();
            size /= DebugDraw.EXTENT;
            const hsize: number = size / 2;
            ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
        }
    }

    private static DrawString_s_color: b2Color = new b2Color(0.9, 0.6, 0.6);
    public DrawString(x: number, y: number, message: string): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.font = "15px DroidSans";
            const color: b2Color = DebugDraw.DrawString_s_color;
            ctx.fillStyle = color.MakeStyleString();
            ctx.fillText(message, x, y);
            ctx.restore();
        }
    }

    public DrawAABB(aabb: b2AABB, color: b2Color): void {
        const ctx: CanvasRenderingContext2D | null = this.m_ctx;
        if (ctx) {
            ctx.strokeStyle = color.MakeStyleString();
            const x: number = aabb.lowerBound.x;
            const y: number = aabb.lowerBound.y;
            const w: number = aabb.upperBound.x - aabb.lowerBound.x;
            const h: number = aabb.upperBound.y - aabb.lowerBound.y;
            ctx.strokeRect(x, y, w, h);
        }
    }
}