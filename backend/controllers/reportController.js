const PDFDocument = require('pdfkit');
const Task = require('../models/Task');

exports.generateTaskReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=task-report.pdf');

    doc.fontSize(20).text('Task Report', { align: 'center' });
    doc.moveDown();

    tasks.forEach((task, idx) => {
      doc.fontSize(14).text(`${idx + 1}. ${task.title}`, { underline: true });
      doc.fontSize(12).text(`Description: ${task.description}`);
      doc.text(`Deadline: ${task.deadline.toDateString()}`);
      doc.text(`Assigned To: ${task.assignedTo ? task.assignedTo.name : 'Unassigned'}`);
      doc.text(`Status: ${task.status}`);
      doc.moveDown();
    });

    doc.pipe(res);
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF report' });
  }
};
