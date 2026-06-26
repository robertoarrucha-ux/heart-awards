
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
    from: `"Heart-Led Summit & Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: 'Confirmación de Nominación - Heart-Led Summit & Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://heart.awards-global.org/unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Heart-Led Summit & Awards 2026</h2>
        <p>Hola <strong>${nomineeName}</strong>,</p>
        <p>Gracias por tu nominación. En las siguientes 75 horas estaremos revisando tu perfil y notificándote si has sido nominado o no.</p>
        <p>En caso de no cumplir con las bases de nominación, podrás volver a nominarte mejorando la información que ingresas en el formulario de Nominación.</p>
        <p>¡Mucho éxito y estamos felices de conocerte!</p>
        <p><strong>Equipo Heart-Led Summit & Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Este es un correo automático de confirmación de nominación. Si no deseas recibir más correos, puedes solicitar la baja respondiendo a este mensaje.
        </p>
      </div>
    `,
    text: `
      Heart-Led Summit & Awards 2026
      
      Hola ${nomineeName},
      
      Muchas gracias por tu nominación. En las próximas 75 horas estaremos revisando tu perfil detalladamente.
      
      En caso de que tu perfil no cumpla con las bases actuales, te notificaremos para que puedas realizar una nueva nominación con información más completa.
      
      ¡Mucho éxito! Estamos felices de conocerte.
      
      Equipo Heart-Led Summit & Awards.
      ---
      Este es un mensaje automático de confirmación relacionado con tu actividad en heart.awards-global.org.
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
    from: `"Heart-Led Summit & Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: 'Your nomination to the Heart-Led Summit & Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://heart.awards-global.org/unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Heart-Led Summit & Awards 2026</h2>
        <p>Te saludo con gusto <strong>${nomineeName}</strong>,</p>
        <p>Estamos encantados con tu perfil y logros. También te agradecemos por tu nominación, es un gusto conocer personas como tú.</p>
        <p>Desgraciadamente, en esta ocasión no cumples el perfil para los Heart-Led Summit & Awards. Puedes consultar nuevamente las bases en <a href="https://heart.awards-global.org/terminos-convocatoria" style="color: #FFD700;">heart.awards-global.org/terminos-convocatoria</a></p>
        
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
          <p style="margin: 10px 0 0 0;">En el siguiente enlace podrás ver el tipo de entradas: <a href="https://heart.awards-global.org/tickets" style="color: #192A56; font-weight: bold;">heart.awards-global.org/tickets</a></p>
        </div>
        
        <p>¡Mucho éxito y estamos felices de conocerte!</p>
        <p><strong>Equipo Heart-Led Summit & Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Este es un correo automático. Si no deseas recibir más comunicaciones, puedes solicitar la baja respondiendo a este mensaje.
        </p>
      </div>
    `,
    text: `
      Heart-Led Summit & Awards 2026
      
      Hola ${nomineeName},
      
      Muchas gracias por tu interés y por compartir tus logros con nosotros.
      
      Lamentablemente, en esta ocasión tu perfil no cumple con los criterios específicos de la convocatoria actual. Te invitamos a revisar las bases en: https://heart.awards-global.org/terminos-convocatoria
      
      ${rejectionNote ? `Nota del comité: ${rejectionNote}\n` : ''}

      ¡No te detengas! Puedes volverte a nominar aportando más evidencias de tu impacto y logros. 
      
      Como agradecimiento, te ofrecemos un cupón del 50% de descuento para asistir a nuestro evento en Madrid y Viena: Código ESPECIAL.
      
      Más información sobre las entradas en: https://heart.awards-global.org/tickets
      
      Atentamente,
      Equipo Heart-Led Summit & Awards.
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
  const profileUrl = `https://heart.awards-global.org/vota`;

  const mailOptions = {
    from: `"Heart-Led Summit & Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: '¡Felicidades! - Nominado Finalista',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://heart.awards-global.org/unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Heart-Led Summit & Awards 2026</h2>
        <p>¡Felicidades <strong>${nomineeName}</strong>!</p>
        <p>Es un placer poder notificarte que estás en la lista de nominados finalistas a los <strong>Heart-Led Summit & Awards</strong>, el evento en Europa de alianzas, negocios y reconocimientos más importante para líderes Latinoamericanos.</p>
        <p>Este evento se lleva a cabo todos los años desde el 2017, y el propósito es poder crear alianzas y negocios entre América Latina y el mundo, promover la inversión y reconocer a las empresas y organizaciones más destacadas de la región.</p>
        
        <h3 style="color: #192A56;">¿Qué sigue?</h3>
        <ul style="line-height: 1.6;">
          <li>Puedes solicitar tu <strong>carta formal como nominado finalista</strong> contestando este correo o vía WhatsApp: <a href="https://wa.me/4367761735010" style="color: #192A56;">+43 677 61 73 5010</a>.</li>
          <li>Ya puedes encontrar tu perfil en la página oficial de nominados y recibir votos: <a href="${profileUrl}" style="color: #192A56; font-weight: bold;">heart.awards-global.org/vota</a></li>
          <li>Encuentra en el siguiente enlace todas las instrucciones y paso a paso que necesitas saber como Nominado Finalista: <a href="https://heart.awards-global.org/bienvenidos-nominados" style="color: #192A56; font-weight: bold;">heart.awards-global.org/bienvenidos-nominados</a></li>
        </ul>
        
        <p>Siempre puedes consultarnos vía WhatsApp: <a href="https://wa.me/4367761735010" style="color: #192A56;">+43 677 61 73 5010</a>.</p>
        
        <p>¡Mucho éxito!</p>
        <p><strong>Equipo Heart-Led Summit & Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Este es un correo automático para finalistas. Puedes gestionar tus preferencias respondiendo a este correo.
        </p>
      </div>
    `,
    text: `
      ¡FELICIDADES ${nomineeName}!
      
      Eres oficialmente Nominado Finalista de los Heart-Led Summit & Awards 2026.
      
      Este es el reconocimiento más importante para líderes latinoamericanos en Europa. Estos son tus siguientes pasos:
      
      1. Tu perfil ya está activo para recibir votos en: https://heart.awards-global.org/vota
      2. Revisa la guía de bienvenida para finalistas: https://heart.awards-global.org/bienvenidos-nominados
      3. Puedes solicitar tu carta formal respondiendo a este correo o por WhatsApp al +43 677 61 73 5010.
      
      Estamos muy orgullos de tus logros.
      
      Atentamente,
      Equipo Heart-Led Summit & Awards.
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
    subject: 'Verificación de cuenta - Heart-Led Summit & Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>, <https://heart.awards-global.org/unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
    },
    text: `
      Hola,
      
      Este es un mensaje de verificación para confirmar que el sistema de notificaciones de Heart-Led Summit & Awards está activo.
      
      Si estás viendo este mensaje, la configuración SMTP es correcta y los correos se están enviando desde el dominio heart.awards-global.org.
      
      Saludos,
      Equipo de Soporte.
    `,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <p>Hola,</p>
        <p>Este es un mensaje automático para verificar la configuración de correo de la plataforma <strong>Heart-Led Summit & Awards 2026</strong>.</p>
        <p>Si has recibido este correo, el sistema está operando correctamente bajo el dominio verificado.</p>
        <br>
        <p>Saludos,<br>Equipo de Soporte</p>
      </div>
    `,
  };

  return await mailTransporter.sendMail(mailOptions);
}

export async function sendPartnerApprovalEmail(to: string, name: string, organization: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';
  const dashboardUrl = 'https://heart.awards-global.org/aliado/dashboard';

  const mailOptions = {
    from: `"Heart-Led Summit & Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: '¡Bienvenido al Programa de Aliados! - Heart-Led Summit & Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Heart-Led Summit & Awards 2026</h2>
        <p>¡Hola <strong>${name}</strong>!</p>
        <p>Nos complace informarte que tu postulación como aliado de <strong>${organization}</strong> ha sido <strong>aprobada</strong>. ¡Bienvenido al Programa de Aliados de los Heart-Led Summit & Awards!</p>

        <div style="background-color: #f0f9ff; border-left: 4px solid #192A56; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #192A56;">🤝 Como aliado oficial, tienes acceso a:</p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #333; line-height: 1.8;">
            <li>Lugares especiales y visibilidad de marca en las sedes de Madrid y Viena</li>
            <li>Cupones de descuento personalizados para tu comunidad (hasta 30%)</li>
            <li>Tu enlace de referido para generar comisiones por ventas</li>
            <li>Espacio de presentación ante 200–300 líderes latinoamericanos y europeos</li>
            <li>Acceso a la red exclusiva de aliados Pro-Latam</li>
          </ul>
        </div>

        <p>Ya puedes acceder a tu panel de aliado para gestionar tus cupones y enlace de referido:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}"
             style="background-color: #192A56; color: #FFD700; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            🚀 Acceder a mi Panel de Aliado
          </a>
        </div>
        <p>Si tienes preguntas, contáctanos por WhatsApp: <a href="https://wa.me/4367761735010" style="color: #192A56;">+43 677 61 73 5010</a></p>
        <p>¡Bienvenido a bordo!</p>
        <p><strong>Equipo Heart-Led Summit & Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Si no deseas recibir más comunicaciones, responde a este correo solicitando la baja.
        </p>
      </div>
    `,
    text: `
      ¡Hola ${name}!

      Tu postulación como aliado de ${organization} ha sido APROBADA.

      Ya puedes acceder a tu panel para gestionar cupones y enlace de referido:
      ${dashboardUrl}

      Como aliado tienes acceso a: lugares especiales en el evento, cupones de descuento, enlace de referido con comisiones, espacio de presentación y red de alianzas.

      ¿Preguntas? WhatsApp: +43 677 61 73 5010

      ¡Bienvenido a bordo!
      Equipo Heart-Led Summit & Awards.
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Partner approval email sent to ${to}`);
  } catch (error) {
    console.error('Error sending partner approval email:', error);
  }
}

export async function sendPartnerRejectionEmail(to: string, name: string, organization: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';

  const mailOptions = {
    from: `"Heart-Led Summit & Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: 'Sobre tu postulación como aliado - Heart-Led Summit & Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Heart-Led Summit & Awards 2026</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Gracias por tu interés en el Programa de Aliados de los Heart-Led Summit & Awards y por postular a <strong>${organization}</strong>.</p>
        <p>Tras revisar tu solicitud, en esta ocasión no hemos podido incorporarte al programa. Seleccionamos a nuestros aliados cuidadosamente para garantizar una red de alto valor para todos los participantes.</p>
        <p>Sin embargo, ¡las puertas del evento siguen abiertas para ti! Te invitamos a acompañarnos como asistente en Madrid (Noviembre 2026) o Viena (Diciembre 2026), donde podrás hacer networking con 200–300 líderes latinoamericanos y europeos.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://heart.awards-global.org/tickets"
             style="background-color: #192A56; color: #FFD700; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            🎟️ Ver Entradas Disponibles
          </a>
        </div>
        <p>Si tienes alguna pregunta o deseas conocer más sobre el programa, contáctanos:</p>
        <p>📱 WhatsApp: <a href="https://wa.me/4367761735010" style="color: #192A56;">+43 677 61 73 5010</a></p>
        <p>¡Gracias de nuevo y esperamos verte en el evento!</p>
        <p><strong>Equipo Heart-Led Summit & Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Si no deseas recibir más comunicaciones, responde a este correo solicitando la baja.
        </p>
      </div>
    `,
    text: `
      Hola ${name},

      Gracias por postular a ${organization} al Programa de Aliados de los Heart-Led Summit & Awards.

      En esta ocasión no hemos podido incorporarte al programa. Sin embargo, te invitamos a asistir al evento como participante:
      https://heart.awards-global.org/tickets

      ¿Preguntas? WhatsApp: +43 677 61 73 5010

      ¡Gracias y esperamos verte en el evento!
      Equipo Heart-Led Summit & Awards.
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Partner rejection email sent to ${to}`);
  } catch (error) {
    console.error('Error sending partner rejection email:', error);
  }
}

function getAccessDays(participationStatus: string, venues: string): string {
  const hasMadrid = venues?.toLowerCase().includes('madrid');
  const hasViena = venues?.toLowerCase().includes('viena') || venues?.toLowerCase().includes('viena');

  const madridDays: Record<string, string> = {
    'Empresas e Inversionistas Europeos': 'Jueves 20 de Noviembre (Día 2)',
    'Premiadas':      'Viernes 21 de Noviembre (Día 3)',
    'Nominados':      'Viernes 21 de Noviembre (Día 3)',
    'Medios':         'Viernes 21 de Noviembre (Día 3)',
    'Aliados':        'Miércoles 19, Jueves 20 y Viernes 21 de Noviembre (Días 1, 2 y 3)',
    'Red Profesional':'Viernes 21 de Noviembre (Día 3)',
  };

  const vienaDays: Record<string, string> = {
    'Empresas e Inversionistas Europeos': 'Jueves 4 de Diciembre (Día 2)',
    'Premiadas':      'Viernes 5 de Diciembre (Día 3)',
    'Nominados':      'Viernes 5 de Diciembre (Día 3)',
    'Medios':         'Viernes 5 de Diciembre (Día 3)',
    'Aliados':        'Miércoles 3, Jueves 4 y Viernes 5 de Diciembre (Días 1, 2 y 3)',
    'Red Profesional':'Viernes 5 de Diciembre (Día 3)',
  };

  const lines: string[] = [];
  if (hasMadrid && madridDays[participationStatus]) {
    lines.push(`🇪🇸 <strong>Madrid:</strong> ${madridDays[participationStatus]}`);
  }
  if (hasViena && vienaDays[participationStatus]) {
    lines.push(`🇦🇹 <strong>Viena:</strong> ${vienaDays[participationStatus]}`);
  }

  return lines.length > 0 ? lines.join('<br>') : 'Confirma tu sede con nuestro equipo.';
}

export async function sendFreeRegistrationApprovalEmail(to: string, firstName: string, participationStatus?: string, venues?: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';

  const accessDays = participationStatus && venues
    ? getAccessDays(participationStatus, venues)
    : 'Confirma tu acceso con nuestro equipo.';

  const mailOptions = {
    from: `"Heart-Led Summit & Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: '¡Tu registro ha sido aprobado! - Heart-Led Summit & Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Heart-Led Summit & Awards 2026</h2>
        <p>¡Hola <strong>${firstName}</strong>!</p>
        <p>Nos complace informarte que tu solicitud de registro gratuito ha sido <strong>aprobada</strong>. ¡Estamos muy felices de contarte entre nuestros asistentes!</p>

        <div style="background-color: #f0f7ff; border-left: 4px solid #192A56; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #192A56;">📅 Tu acceso al evento:</p>
          <p style="margin: 0; color: #333;">${accessDays}</p>
        </div>

        <p>Para estar al tanto de todas las novedades, horarios y detalles del evento, únete a nuestro grupo oficial de WhatsApp:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn"
             style="background-color: #25D366; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            📱 Unirme al Grupo de WhatsApp
          </a>
        </div>
        <p>Ahí recibirás información sobre el programa, logística y todo lo que necesitas saber como asistente.</p>
        <p>¡Nos vemos pronto!</p>
        <p><strong>Equipo Heart-Led Summit & Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Si no deseas recibir más comunicaciones, responde a este correo solicitando la baja.
        </p>
      </div>
    `,
    text: `
      ¡Hola ${firstName}!

      Tu solicitud de registro gratuito ha sido APROBADA para los Heart-Led Summit & Awards 2026.

      Tu acceso: ${accessDays.replace(/<[^>]+>/g, '')}

      Únete a nuestro grupo de WhatsApp para recibir todas las novedades:
      https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn

      ¡Nos vemos pronto!
      Equipo Heart-Led Summit & Awards.
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Free registration approval email sent to ${to}`);
  } catch (error) {
    console.error('Error sending free registration approval email:', error);
  }
}

export async function sendFreeRegistrationRejectionEmail(to: string, firstName: string) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  const fromEmail = process.env.ACUMBAMAIL_FROM_EMAIL || process.env.EMAIL_FROM || 'awards@pro-latam.org';

  const mailOptions = {
    from: `"Heart-Led Summit & Awards" <${fromEmail}>`,
    to,
    replyTo: fromEmail,
    subject: 'Sobre tu solicitud de registro - Heart-Led Summit & Awards',
    headers: {
      'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>`,
      'List-Id': `"Heart-Led Summit & Awards" <heart.awards-global.org>`,
      'X-Entity-Ref-ID': Date.now().toString(),
    },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #192A56; text-align: center;">Heart-Led Summit & Awards 2026</h2>
        <p>Hola <strong>${firstName}</strong>,</p>
        <p>Gracias por tu interés en asistir a los Heart-Led Summit & Awards 2026. Hemos revisado tu solicitud de acceso gratuito y en esta ocasión no ha podido ser aprobada.</p>
        <p>Sin embargo, ¡las puertas del evento siguen abiertas para ti! Puedes adquirir tu entrada y vivir una experiencia única de networking, alianzas y reconocimientos con líderes de toda América Latina y Europa.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://heart.awards-global.org/tickets"
             style="background-color: #192A56; color: #FFD700; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            🎟️ Ver Entradas Disponibles
          </a>
        </div>
        <p>Si tienes alguna pregunta, puedes contactarnos por WhatsApp: <a href="https://wa.me/4367761735010" style="color: #192A56;">+43 677 61 73 5010</a></p>
        <p>¡Esperamos verte en el evento!</p>
        <p><strong>Equipo Heart-Led Summit & Awards.</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Si no deseas recibir más comunicaciones, responde a este correo solicitando la baja.
        </p>
      </div>
    `,
    text: `
      Hola ${firstName},

      Hemos revisado tu solicitud de acceso gratuito a los Heart-Led Summit & Awards 2026 y en esta ocasión no ha podido ser aprobada.

      Sin embargo, puedes adquirir tu entrada en:
      https://heart.awards-global.org/tickets

      ¿Tienes preguntas? Contáctanos por WhatsApp: +43 677 61 73 5010

      ¡Esperamos verte en el evento!
      Equipo Heart-Led Summit & Awards.
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Free registration rejection email sent to ${to}`);
  } catch (error) {
    console.error('Error sending free registration rejection email:', error);
  }
}
