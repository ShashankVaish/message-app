import amqp from "amqplib";

export async function sendToQueue(queue, message) {
    const conn = await amqp.connect("amqp://localhost");
    const ch = await conn.createChannel();
    await ch.assertQueue(queue);
    ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    setTimeout(() => conn.close(), 500);
}
