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
  const { fullname, email } = req.body;

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
      <h1>Cybersecurity Awareness Challenge</h1>
    </div>

    <div style="padding:30px">

      <p>Hello <strong>${fullname}</strong>,</p>

      <p>
      This message is part of a cybersecurity awareness exercise.
      Click the button below to begin the challenge and learn
      how phishing attacks commonly work.
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
          Start Awareness Challenge
        </a>
      </div>

      <p>
      You'll be shown common phishing warning signs and
      practical tips for protecting your accounts.
      </p>

      <hr>

      <p style="font-size:12px;color:#666">
      Educational training email.
      </p>

    </div>

  </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Cyber Awareness Demo" <YOUR_EMAIL@gmail.com>',
      to: email,
      subject: "Cybersecurity Awareness Challenge",
      html: emailTemplate
    });

    res.redirect("/success.html");
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/challenge", (req, res) => {
  const name = req.query.name || "Guest";

  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
  <title>Awareness Challenge</title>

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

      <h1>🎣 Phishing Awareness Exercise</h1>

      <div class="banner">
      Welcome ${name}. This is a cybersecurity awareness exercise.
      Many phishing emails rely on urgency, fear, rewards, and
      suspicious links to trick people into acting quickly.
      </div>

      <h2>Common Red Flags</h2>

      <div class="grid">

        <div class="box">
          <h3>Unexpected Messages</h3>
          <p>
          Be cautious when receiving emails you weren't expecting.
          </p>
        </div>

        <div class="box">
          <h3>Urgency</h3>
          <p>
          Attackers often pressure people into acting immediately.
          </p>
        </div>

        <div class="box">
          <h3>Suspicious Links</h3>
          <p>
          Always inspect links before clicking.
          </p>
        </div>

        <div class="box">
          <h3>Information Requests</h3>
          <p>
          Never provide sensitive information through email links.
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
