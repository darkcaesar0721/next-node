import type { NextApiRequest, NextApiResponse } from "next";
import {
  mailOptions,
  purchaseEmailTemplate,
  transporter,
} from "@/config/nodemailer";
import { SafeString } from "handlebars";

type Data = {
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "POST") {
    const {
      dataLimitInGB,
      startDate,
      endDate,
      qrCodeImage,
      iccid,
      subject,
      email,
    } = req.body;

    if (!startDate || !endDate || !qrCodeImage || !iccid) {
      return res
        .status(400)
        .json({ message: "purchase, profile, destination required" });
    }
    try {
      await transporter.sendMail({
        ...mailOptions,
        to: email || mailOptions.to,
        subject:
          subject || "GlobeTravelSA - eSIM Topup",
        text: `This email confirms your eSIM Topup of + ${dataLimitInGB}GB package. The eSIM is valid in DNK starting ${startDate} through ${endDate}.`,
        html: purchaseEmailTemplate({
          dataLimitInGB,
          startDate,
          endDate,
          qrCodeImage: new SafeString(qrCodeImage),
          iccid,
        }),
        attachments: [
          {
            filename: "qrCode.png", // Replace with the desired filename
            path: qrCodeImage,
            cid: "image@unique.com", // Content-ID for inline image
            encoding: "base64",
            contentDisposition: "inline",
            contentTransferEncoding: "base64",
            contentType: "image/png",
          },
        ],
      });
      return res
        .status(200)
        .json({ message: "Email has been sent sucessfully!" });
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  } else {
    return res.status(400).json({ message: "Bad request" });
  }
};
export default handler;
