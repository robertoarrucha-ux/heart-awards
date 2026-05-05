
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const host = process.env.ACUMBAMAIL_SMTP_HOST || process.env.EMAIL_HOST;
    const port = parseInt(process.env.ACUMBAMAIL_SMTP_PORT || process.env.EMAIL_PORT || '587');
    const user = process.env.ACUMBAMAIL_SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.ACUMBAMAIL_SMTP_PASS || process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
      console.warn('SMTP configuration is missing. Emails will not be sent.');
      return null;
    }

    const isSecure = port === 465;

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: {
        user,
        pass,
      },
      tls: {
        // For port 465 we use SSL, for 587/2525 we use STARTTLS
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      debug: true, 
      logger: true 
    });
  }
  return transporter;
}

export async function sendConfirmationEmail(to: string, nomineeName: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';

  const mailOptions = {
    from: `"Latin American Leaders Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: 'Confirmación de Nominación - Latin American Leaders Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://awards.pro-latam.org/unsubscribe>`,
      'List-Id': `"Latin American Leaders Awards" <awards.pro-latam.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Latin American Leaders Awards 2026</h2>
        <p>Hola <strong>${nomineeName}</strong>,</p>
        <p>Gracias por tu nominación. En las siguientes 75 horas estaremos revisando tu perfil y notificándote si has sido nominado o no.</p>
        <p>En caso de no cumplir con las bases de nominación, podrás volver a nominarte mejorando la información que ingresas en el formulario de Nominación.</p>
        <p>¡Mucho éxito y estamos felices de conocerte!</p>
        <p><strong>Equipo Latin American Leaders Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Este es un correo automático de confirmación de nominación. Si no deseas recibir más correos, puedes solicitar la baja respondiendo a este mensaje.
        </p>
      </div>
    `,
    text: `
      Latin American Leaders Awards 2026
      
      Hola ${nomineeName},
      
      Muchas gracias por tu nominación. En las próximas 75 horas estaremos revisando tu perfil detalladamente.
      
      En caso de que tu perfil no cumpla con las bases actuales, te notificaremos para que puedas realizar una nueva nominación con información más completa.
      
      ¡Mucho éxito! Estamos felices de conocerte.
      
      Equipo Latin American Leaders Awards.
      ---
      Este es un mensaje automático de confirmación relacionado con tu actividad en awards.pro-latam.org.
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${to}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

export async function sendRejectionEmail(to: string, nomineeName: string, rejectionNote?: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';

  const mailOptions = {
    from: `"Latin American Leaders Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: 'Tu nominación a los Latam Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://awards.pro-latam.org/unsubscribe>`,
      'List-Id': `"Latin American Leaders Awards" <awards.pro-latam.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Latin American Leaders Awards 2026</h2>
        <p>Te saludo con gusto <strong>${nomineeName}</strong>,</p>
        <p>Estamos encantados con tu perfil y logros. También te agradecemos por tu nominación, es un gusto conocer personas como tú.</p>
        <p>Desgraciadamente, en esta ocasión no cumples el perfil para los Latin American Leaders Awards. Puedes consultar nuevamente las bases en <a href="https://awards.pro-latam.org/terminos-convocatoria" style="color: #FFD700;">awards.pro-latam.org/terminos-convocatoria</a></p>
        
        ${rejectionNote ? `
        <div style="background-color: #fff4f4; padding: 15px; border-radius: 5px; border-left: 4px solid #cc0000; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #cc0000;">Nota del comité evaluador:</p>
          <p style="margin: 10px 0 0 0; color: #333;">${rejectionNote}</p>
        </div>
        ` : ''}

        <h3 style="color: #192A56;">¿Qué puedes hacer?</h3>
        <p>Puedes <strong>NOMINARTE NUEVAMENTE</strong> o nominar a tu empresa/organización siguiendo las bases de la convocatoria, mostrando más y mejor evidencia de tus logros. Ejemplo: Generación de empleo o creación de empresas innovadoras en tu región, Facturación anual, tecnología aplicada, patentes, reconocimientos, número de clientes, premios anteriores, personas impactadas, etc.</p>
        
        <p>Si no cumples con esto, no obstante, nos gustaría poderte extender una invitación para que puedas acompañarnos durante el evento en Madrid, España y/o Viena, Austria. Estamos seguros de que conocerás personas maravillosas de todas partes de América Latina y Europa, harás alianzas y encontrarás oportunidades.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #FFD700; margin: 20px 0;">
          <p style="margin: 0;">Recibe un <strong>cupón de descuento del 50%</strong> para que puedas aplicarlo en cualquiera de las agendas (General o VIP): <strong>ESPECIAL</strong></p>
          <p style="margin: 10px 0 0 0;">En el siguiente enlace podrás ver el tipo de entradas: <a href="https://awards.pro-latam.org/tickets" style="color: #192A56; font-weight: bold;">awards.pro-latam.org/tickets</a></p>
        </div>
        
        <p>¡Mucho éxito y estamos felices de conocerte!</p>
        <p><strong>Equipo Latin American Leaders Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Este es un correo automático. Si no deseas recibir más comunicaciones, puedes solicitar la baja respondiendo a este mensaje.
        </p>
      </div>
    `,
    text: `
      Latin American Leaders Awards 2026
      
      Hola ${nomineeName},
      
      Muchas gracias por tu interés y por compartir tus logros con nosotros.
      
      Lamentablemente, en esta ocasión tu perfil no cumple con los criterios específicos de la convocatoria actual. Te invitamos a revisar las bases en: https://awards.pro-latam.org/terminos-convocatoria
      
      ${rejectionNote ? `Nota del comité: ${rejectionNote}\n` : ''}

      ¡No te detengas! Puedes volverte a nominar aportando más evidencias de tu impacto y logros. 
      
      Como agradecimiento, te ofrecemos un cupón del 50% de descuento para asistir a nuestro evento en Madrid y Viena: Código ESPECIAL.
      
      Más información sobre las entradas en: https://awards.pro-latam.org/tickets
      
      Atentamente,
      Equipo Latin American Leaders Awards.
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${to}`);
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
}

export async function sendApprovalEmail(to: string, nomineeName: string, nomineeId: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';
  const profileUrl = `https://awards.pro-latam.org/vota`;

  const mailOptions = {
    from: `"Latin American Leaders Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: '¡Felicidades! - Nominado Finalista',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://awards.pro-latam.org/unsubscribe>`,
      'List-Id': `"Latin American Leaders Awards" <awards.pro-latam.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Latin American Leaders Awards 2026</h2>
        <p>¡Felicidades <strong>${nomineeName}</strong>!</p>
        <p>Es un placer poder notificarte que estás en la lista de nominados finalistas a los <strong>Latin American Leaders Awards</strong>, el evento en Europa de alianzas, negocios y reconocimientos más importante para líderes Latinoamericanos.</p>
        <p>Este evento se lleva a cabo todos los años desde el 2017, y el propósito es poder crear alianzas y negocios entre América Latina y el mundo, promover la inversión y reconocer a las empresas y organizaciones más destacadas de la región.</p>
        
        <h3 style="color: #192A56;">¿Qué sigue?</h3>
        <ul style="line-height: 1.6;">
          <li>Puedes solicitar tu <strong>carta formal como nominado finalista</strong> contestando este correo o vía WhatsApp: <a href="https://wa.me/4367761735010" style="color: #192A56;">+43 677 61 73 5010</a>.</li>
          <li>Ya puedes encontrar tu perfil en la página oficial de nominados y recibir votos: <a href="${profileUrl}" style="color: #192A56; font-weight: bold;">awards.pro-latam.org/vota</a></li>
          <li>Encuentra en el siguiente enlace todas las instrucciones y paso a paso que necesitas saber como Nominado Finalista: <a href="https://awards.pro-latam.org/bienvenidos-nominados" style="color: #192A56; font-weight: bold;">awards.pro-latam.org/bienvenidos-nominados</a></li>
        </ul>
        
        <p>Siempre puedes consultarnos vía WhatsApp: <a href="https://wa.me/4367761735010" style="color: #192A56;">+43 677 61 73 5010</a>.</p>
        
        <p>¡Mucho éxito!</p>
        <p><strong>Equipo Latin American Leaders Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Este es un correo automático para finalistas. Puedes gestionar tus preferencias respondiendo a este correo.
        </p>
      </div>
    `,
    text: `
      ¡FELICIDADES ${nomineeName}!
      
      Eres oficialmente Nominado Finalista de los Latin American Leaders Awards 2026.
      
      Este es el reconocimiento más importante para líderes latinoamericanos en Europa. Estos son tus siguientes pasos:
      
      1. Tu perfil ya está activo para recibir votos en: https://awards.pro-latam.org/vota
      2. Revisa la guía de bienvenida para finalistas: https://awards.pro-latam.org/bienvenidos-nominados
      3. Puedes solicitar tu carta formal respondiendo a este correo o por WhatsApp al +43 677 61 73 5010.
      
      Estamos muy orgullos de tus logros.
      
      Atentamente,
      Equipo Latin American Leaders Awards.
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${to}`);
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
}

export async function sendTestEmail(to: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    throw new Error('SMTP configuration is missing or invalid.');
  }

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';

  const mailOptions = {
    from: fromEmail,
    to,
    replyTo: fromEmail,
    subject: 'Verificación de cuenta - Latin American Leaders Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://awards.pro-latam.org/unsubscribe>`,
      'List-Id': `"Latin American Leaders Awards" <awards.pro-latam.org>`,
    },
    text: `
      Hola,
      
      Este es un mensaje de verificación para confirmar que el sistema de notificaciones de Latin American Leaders Awards está activo.
      
      Si estás viendo este mensaje, la configuración SMTP es correcta y los correos se están enviando desde el dominio awards.pro-latam.org.
      
      Saludos,
      Equipo de Soporte.
    `,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <p>Hola,</p>
        <p>Este es un mensaje automático para verificar la configuración de correo de la plataforma <strong>Latin American Leaders Awards 2026</strong>.</p>
        <p>Si has recibido este correo, el sistema está operando correctamente bajo el dominio verificado.</p>
        <br>
        <p>Saludos,<br>Equipo de Soporte</p>
      </div>
    `,
  };

  return await mailTransporter.sendMail(mailOptions);
}
