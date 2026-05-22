export interface TelegramOrderNotificationPayload {
  orderNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  deliveryAddress: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  createdAt: Date;
}

/**
 * Sends a notification message to the configured Telegram chat when a new order is received.
 * This is non-blocking (fire-and-forget) and safe against config/network failures.
 */
export async function sendOrderNotification(order: TelegramOrderNotificationPayload): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Guard: if TELEGRAM_BOT_TOKEN is not configured, do not attempt to send
    if (!botToken) {
      return;
    }

    if (!chatId) {
      console.warn("[Telegram Notification] Skipped: TELEGRAM_CHAT_ID is missing.");
      return;
    }

    const timeInIST = new Date(order.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const customer = order.customerName || order.customerPhone || order.customerEmail || "Guest";
    const itemsText = order.items
      .map((item) => `- ${item.name} x${item.quantity} — ₹${item.price}`)
      .join("\n");

    const text = `🛒 *New Order Received!*\n\n` +
      `📦 Order: ${order.orderNumber}\n` +
      `👤 Customer: ${customer}\n` +
      `📍 Address: ${order.deliveryAddress}\n\n` +
      `🧾 Items:\n${itemsText}\n\n` +
      `💰 Total: ₹${order.totalAmount}\n` +
      `🕐 Time: ${timeInIST}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Using Node.js built-in fetch
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Telegram Notification] Failed to send message. Status: ${response.status}. Response: ${errorText}`);
    }
  } catch (error) {
    console.error("[Telegram Notification] Error sending notification:", error);
  }
}
