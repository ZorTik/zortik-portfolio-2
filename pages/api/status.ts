import type { NextApiRequest, NextApiResponse } from 'next'

type StatusMessage = 'OK' | 'ERROR'
type Data = {
  status: StatusMessage
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ status: 'OK' });
}
