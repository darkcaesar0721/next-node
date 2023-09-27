// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  clientSecret?: string;
  error?: {
    message: string | undefined;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // if (req.method === "POST") {
  return createPaymentIntent(req, res);
  // } else {
  // res.setHeader("Allow", ["POST"]);
  // res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}

async function createPaymentIntent(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2020-08-27",
    });
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e: any) {
    return res.status(400).send({
      error: {
        message: e.message ?? undefined,
      },
    });
  }
}
