import { transporter } from "@/src/lib/mailer";

export async function sendOtpEmail(email: string, code: string) {
  const info = await transporter.sendMail({
    from: '"RestoFlow" <no-reply@restoflow.com>',
    to: email,
    subject: "Código de verificación",
    html: ` 
    <div style="margin:0;padding:0;background:#f1f1f1;font-family:Inter,Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border:1px solid #e4e4df;border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:32px 24px 20px;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#8a8a84;font-family:monospace;">
                RestoFlow
              </div>


          <h1 style="margin:12px 0 8px;font-size:34px;line-height:1.1;font-weight:400;font-style:italic;color:#1a1a1a;">
            Confirmá tu cuenta.
          </h1>

          <p style="margin:0;color:#4f4f49;font-size:14px;line-height:1.6;">
            Usá el siguiente código para verificar tu email y comenzar a gestionar tu restaurante.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding:8px 24px 24px;">
          <div style="background:#f7f7f4;border:1px solid #e4e4df;border-radius:14px;padding:20px 12px;text-align:center;max-width:100%;box-sizing:border-box;">
            <div style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#8a8a84;margin-bottom:10px;">
              Código de verificación
            </div>

            <div style="font-family:monospace;font-size:28px;font-weight:700;letter-spacing:.12em;color:#1a1a1a;word-break:break-all;line-height:1.3;">
                ${code}
            </div>
          </div>
          <div style="text-align:center;max-width:100%; padding-top:10px;">

            <a href="${process.env.NEXT_PUBLIC_FRONT}/auth/verify-email" style="display:inline-block;background:#1a1a1a;color:#f1f1f1;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:500;">
              Verificar cuenta
            </a>
        </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 32px;">
          <p style="margin:0;color:#8a8a84;font-size:12px;line-height:1.6;">
            Si no creaste una cuenta en RestoFlow, podés ignorar este correo.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:18px 0 0;color:#8a8a84;font-size:11px;">
      RestoFlow · Restaurant OS
    </p>
  </td>
</tr>

  </table>
</div>

    `,
  });
}

