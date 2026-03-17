export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle contact form submission
    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    // Everything else is handled by static assets (wrangler assets)
    return new Response("Not Found", { status: 404 });
  },
};

async function handleContact(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required." }),
        { status: 400, headers }
      );
    }

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Quintessential Website <${env.FROM_EMAIL}>`,
        to: [env.CONTACT_EMAIL],
        subject: `New Inquiry from ${name}`,
        reply_to: email,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1B4D6E; border-bottom: 2px solid #C4A43B; padding-bottom: 10px;">
              New Website Inquiry
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #1B4D6E; width: 100px;">Name:</td>
                <td style="padding: 8px 12px;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #1B4D6E;">Email:</td>
                <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #1B4D6E;">Phone:</td>
                <td style="padding: 8px 12px;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td>
              </tr>` : ""}
            </table>
            <div style="background: #f8f6f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1B4D6E; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 30px;">
              Sent from the Quintessential Concierge website contact form.
            </p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("Resend error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send message. Please try again." }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Thank you! We'll be in touch soon." }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers }
    );
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
