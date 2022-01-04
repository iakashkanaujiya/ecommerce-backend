const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  // Create a radial gradient
  doc.circle(100, -10, 80);
  doc.fill("red");

  doc.circle(180, -20, 50);
  doc.fill("gray");

  doc.circle(60, 50, 30);
  doc.fill("#333333");

  doc.circle(500, -10, 60);
  doc.fill("orange");

  doc
    .image("public/uploads/logo.png", 50, 70, { width: 150 })
    .fontSize(10)
    .fillColor("#333333")
    .text("Just Pantry", 200, 75, { align: "right" })
    .text("Near J.P Girls Inter College, Chaudhrana", 200, 90, { align: "right" })
    .text("Kannauj, Uttar Pradesh, India, 209725", 200, 105, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 180);

  generateHr(doc, 205);

  const customerInformationTop = 225;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop)
    .text(formatDate(new Date()), 150, customerInformationTop)
    .text("Total Amount", 50, customerInformationTop + 15)
    .text(
      formatCurrency(invoice.totalAmount),
      150,
      customerInformationTop + 15
    ).text("Payment Type", 50, customerInformationTop + 30)
    .text(
      invoice.paymentType,
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.address.firstname + " " + invoice.address.lastname, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.address.address1 + " " + invoice.address.address2, 300, customerInformationTop + 15)
    .text(
      invoice.address.city +
      ", " +
      invoice.address.state +
      ", " +
      invoice.address.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 280);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      "",
      formatCurrency(item.sellingPrice),
      item.quantity,
      formatCurrency(item.subTotal)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subTotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Shipping Charges",
    "",
    formatCurrency(invoice.shipping)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Total Amount",
    "",
    formatCurrency(invoice.totalAmount)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thank you for Shopping with us, have a great day.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "Rs." + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};
