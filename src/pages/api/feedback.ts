import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Save feedback to database or send email/Slack/webhook here
    const { name, email, message } = req.body;
    // TODO: Save or process feedback
    return res.status(200).json({ success: true });
  }
  res.status(405).end(); // Method Not Allowed
}
