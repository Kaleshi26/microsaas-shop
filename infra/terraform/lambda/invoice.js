import PDFDocument from 'pdfkit';

export const handler = async (event) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
  const { orderId = 'N/A', amountCents = 0 } = body;
  const doc = new PDFDocument();
  const chunks = [];
  return await new Promise((resolve) => {
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => {
      const pdf = Buffer.concat(chunks).toString('base64');
      resolve({ statusCode: 200, isBase64Encoded: true, headers: { 'Content-Type': 'application/pdf' }, body: pdf });
    });
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.text(`Order: ${orderId}`);
    doc.text(`Amount: $${(amountCents / 100).toFixed(2)}`);
    doc.end();
  });
};