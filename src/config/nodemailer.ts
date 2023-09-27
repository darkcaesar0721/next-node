import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
const user = process.env.USER_EMAIL;
const pass = process.env.USER_PASSWORD;
const host = process.env.USER_EMAIL_HOST;
import handlebars from "handlebars";

export const transporter = nodemailer.createTransport({
  // service: "gmail",
  // auth: {
  //   user,
  //   pass,
  // },

  host: host,
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});

const purchaseEmailTemplateDir = path.join(
  "src/lib/email/purchaseEmailTemplate.hbs"
);

const purchaseSource = fs.readFileSync(purchaseEmailTemplateDir, {
  encoding: "utf-8",
});

const purchaseTemplate = handlebars.compile(purchaseSource);

export const purchaseEmailTemplate = (data: any) => purchaseTemplate(data);

export const mailOptions = {
  from: user,
  to: user,
};
