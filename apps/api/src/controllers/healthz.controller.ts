import type { Request, Response } from "express";

export function handleHealthz(_req: Request, res: Response) {
  res.json({ ok: true });
}

