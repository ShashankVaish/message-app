import amqp from "amqplib";

export async function consumeFromQueue(queue, io) {
    const conn = await amqp.connect("amqp://localhost");
    const ch = await conn.createChannel();
    await ch.assertQueue(queue);
    ch.consume(queue, (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            io.emit("receive_message", data); // Emit to all connected clients
            ch.ack(msg);
        }
    });
}
