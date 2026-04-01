
export const emailTemplete = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Saraha – Verify Your Identity</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#0e0a1a;font-family:'DM Sans',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0e0a1a;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;border-radius:20px;overflow:hidden;background:linear-gradient(160deg,#1a1030 0%,#120d25 100%);border:1px solid rgba(150,100,255,0.18);box-shadow:0 0 60px rgba(120,60,255,0.15);">

          <!-- Header glow bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#7c3aed,#a855f7,#c084fc);height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Logo & Brand -->
          <tr>
            <td align="center" style="padding:44px 40px 28px;">
              <div style="display:inline-block;margin-bottom:16px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="width:52px;height:52px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:14px;text-align:center;vertical-align:middle;">
                      <span style="font-size:26px;line-height:52px;">🔒</span>
                    </td>
                  </tr>
                </table>
              </div>
              <br/>
              <span style="font-family:'Cairo',sans-serif;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Saraha</span>
              <br/>
              <span style="font-size:12px;color:#7c5cbf;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Anonymous Messaging</span>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(150,100,255,0.3),transparent);"></div>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:36px 40px 20px;text-align:center;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f0eaff;">Verify Your Identity</p>
              <p style="margin:0;font-size:15px;color:#9478c8;line-height:1.6;">
                Use the code below to complete your verification.<br/>
                It expires in <strong style="color:#c084fc;">10 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:20px 40px 32px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1));border:1.5px solid rgba(168,85,247,0.4);border-radius:16px;padding:22px 48px;text-align:center;">
                    <span style="font-family:'Cairo',sans-serif;font-size:46px;font-weight:900;letter-spacing:12px;color:#e9d5ff;display:block;">${otp}</span>
                    <span style="font-size:11px;color:#7c5cbf;letter-spacing:2px;text-transform:uppercase;margin-top:6px;display:block;">One-Time Password</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#f87171;line-height:1.6;">
                      ⚠️&nbsp; <strong>Never share this code</strong> with anyone. Saraha will never ask for your OTP via chat or phone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info -->
          <tr>
            <td style="padding:0 40px 36px;">
              <p style="margin:0;font-size:13.5px;color:#6b4fa0;text-align:center;line-height:1.7;">
                If you didn't request this code, you can safely ignore this email.<br/>
                Someone may have entered your email address by mistake.
              </p>
            </td>
          </tr>

          <!-- Bottom glow bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#7c3aed,#a855f7,#c084fc);height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0b0818;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#4a3470;">
                © 2025 Saraha App · All rights reserved
              </p>
              <p style="margin:0;font-size:12px;color:#4a3470;">
                <a href="#" style="color:#7c3aed;text-decoration:none;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="#" style="color:#7c3aed;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`}