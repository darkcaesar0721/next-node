import { Celitech } from '@celitech/celitech-sdk'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  clientSecret?: string
  error?: {
    message: string | undefined
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    return getPackages(req, res)
  }

  async function getPackages(req: NextApiRequest, res: NextApiResponse<Data>) {
    const celitech = new Celitech({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
      environment: 'PRODUCTION',
    })
    celitech.packages
      .list(req.query)
      .then((response: any) => {
        res.status(200).json(response)
      })
      .catch((error) => {
        res.status(400).json({
          error: error.message,
        })
      })
  }
}
