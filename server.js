const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

const app = express();
dotenv.config()
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD

  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/register", async (req, res) => {
  const { fullname, email , bank} = req.body;

  const challengeLink =
    `https://school-yech-day-project.vercel.app/challenge?name=${encodeURIComponent(fullname)}`;

  const emailTemplate = `
  <div style="
    max-width:650px;
    margin:auto;
    font-family:Arial,sans-serif;
    border:1px solid #e5e7eb;
    border-radius:16px;
    overflow:hidden;
  ">

    <div style="
      background:#2563eb;
      color:white;
      padding:30px;
      text-align:center;
    ">
      <h1>Nigerians Pull Of Funds Collection</h1>
    </div>

    <div style="padding:30px">

      <p>Hello <strong>${fullname}</strong>,</p>

      <p>
      This message is part of the process of registering for the nigerian
      pull of funds, you are one step away from claiming you own percent of the fund.
      </p>

      <div style="text-align:center;margin:35px 0;">
        <a href="${challengeLink}"
        style="
          background:#2563eb;
          color:white;
          text-decoration:none;
          padding:15px 25px;
          border-radius:8px;
          font-weight:bold;
          display:inline-block;
        ">
          Collect My Share
        </a>
      </div>

      <p>
      You'll will receive your share in your bank immediately.
      </p>

      <hr>

      <p style="font-size:12px;color:#666">
      My Percent Of The Funds email.
      </p>

    </div>

  </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Central Bank Of Nigeria" <YOUR_EMAIL@gmail.com>',
      to: email,
      subject: "Nigeria Pull Of Fund",
      html: emailTemplate
    });

    res.redirect("/success.html");
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/challenge", (req, res) => {
  const name = req.query.name || "Guest";
  const bank = req.query.bank || bank

  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
  <title>Take Your Share</title>

  <style>

  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Inter,Arial,sans-serif;
  }

  body{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#0f172a,#1e293b,#2563eb);
    padding:30px;
  }

  .card{
    max-width:900px;
    width:100%;
    background:white;
    border-radius:24px;
    padding:40px;
    box-shadow:0 20px 60px rgba(0,0,0,.25);
  }

  h1{
    margin-bottom:20px;
  }

  .banner{
    background:#fef3c7;
    padding:18px;
    border-radius:12px;
    margin-bottom:25px;
  }

  .grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
    margin-top:20px;
  }

  .box{
    background:#f3f4f6;
    padding:20px;
    border-radius:14px;
  }

  @media(max-width:700px){
    .grid{
      grid-template-columns:1fr;
    }
  }

  </style>

  </head>
  <body>

    <div class="card">

      <h1>🎣 Debit Alert From ${bank} </h1>

      <div class="banner">
      Ten Million Nira(10,000000) Has Been Deducted From Your Account.
      Weldone ${name}. Thank You For Your Donation To IMPERIAL LIGTHS COLLEGE  .
      </div>

      <h2>Break Down Of Your Donation</h2>

      <div class="grid">

        <div class="box">
          <h3>AIR CONDITION</h3>
          <p>
          2.5 million is for the school CLASS AIR CONDITION.
          </p>
        </div>

        <div class="box">
          <h3>SCHOOL BUS</h3>
          <p>
          2.5 million is for the SCHOOL BUS.
          </p>
        </div>

        <div class="box">
          <h3>SCHOOL SOLAR SYSTEM</h3>
          <p>
          2.5 million is for the SCHOOL UPCOMING SOLAR SYSTEM.
          </p>
        </div>

        <div class="box">
          <h3>SCHOOL VACATION TO DUBAI</h3>
          <p>
          2.5 million is for the SCHOOL VACATION TO DUBAI.
          </p>
        </div>

      </div>

    </div>

  </body>
  </html>
  `);
});

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
