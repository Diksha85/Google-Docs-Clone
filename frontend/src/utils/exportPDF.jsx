// src/utils/exportPDF.jsx
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export a DOM element to PDF
 * @param {HTMLElement} element - The element to capture
 * @param {string} fileName - Name of the downloaded PDF
 */
export const exportToPDF = async (element, fileName = "document.pdf") => {
  if (!element) return;

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages if content is long
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Failed to export PDF:", error);
  }
};
