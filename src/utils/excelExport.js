import ExcelJS from "exceljs";

/**
 * Exports the provided status tracker entries list to a professionally styled Excel file.
 * Filename: JSDT Status.xlsx
 * Columns: S.NO, TYPE, FEATURE, DESCRIPTION, PRIORITY, ASSIGNEE, QA STATUS, TASK ID, TICKET STATUS, NOTES
 * Header Banner: Date in A1/A2, Merged title banner "BUG TRACKING DASHBOARD" in C1:J1.
 * Theme: Navy Headers, Light Slate Grid borders, Conditional colors for QA Status and Ticket Status.
 */
export const exportToExcel = async (entries) => {
  if (!entries || entries.length === 0) {
    alert("No entries to export.");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BUG TRACKING DASHBOARD");

    // Enable grid lines visibility explicitly
    worksheet.views = [{ showGridLines: true }];

    // Column Definitions and standard widths
    worksheet.columns = [
      { key: "sno", width: 8 },
      { key: "type", width: 14 },
      { key: "feature", width: 25 },
      { key: "description", width: 45 },
      { key: "priority", width: 14 },
      { key: "assignee", width: 22 },
      { key: "qaStatus", width: 16 },
      { key: "taskId", width: 16 },
      { key: "ticketStatus", width: 18 },
      { key: "notes", width: 30 },
    ];

    // Style Row 1
    const r1 = worksheet.getRow(1);
    r1.height = 24;
    
    // Cell A1 "Date"
    const cellA1 = r1.getCell(1);
    cellA1.value = "Date";
    cellA1.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF1E3A8A" } };
    cellA1.alignment = { vertical: "middle", horizontal: "center" };
    cellA1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } }; // Slate-200
    cellA1.border = {
      top: { style: "thin", color: { argb: "FF94A3B8" } },
      left: { style: "thin", color: { argb: "FF94A3B8" } },
      bottom: { style: "thin", color: { argb: "FF94A3B8" } },
      right: { style: "thin", color: { argb: "FF94A3B8" } }
    };

    // Merged C1:J1 "BUG TRACKING DASHBOARD"
    worksheet.mergeCells("C1:J1");
    const titleCell = worksheet.getCell("C1");
    titleCell.value = "BUG TRACKING DASHBOARD";
    titleCell.font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } }; // Navy Blue
    titleCell.border = {
      top: { style: "thin", color: { argb: "FF475569" } },
      left: { style: "thin", color: { argb: "FF475569" } },
      bottom: { style: "thin", color: { argb: "FF475569" } },
      right: { style: "thin", color: { argb: "FF475569" } }
    };

    // Style Row 2
    const r2 = worksheet.getRow(2);
    r2.height = 20;
    
    // Cell A2 date value
    const cellA2 = r2.getCell(1);
    cellA2.value = entries[0]?.date || new Date().toLocaleDateString("en-GB");
    cellA2.font = { name: "Segoe UI", size: 10, bold: true };
    cellA2.alignment = { vertical: "middle", horizontal: "center" };
    cellA2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
    cellA2.border = {
      top: { style: "thin", color: { argb: "FF94A3B8" } },
      left: { style: "thin", color: { argb: "FF94A3B8" } },
      bottom: { style: "thin", color: { argb: "FF94A3B8" } },
      right: { style: "thin", color: { argb: "FF94A3B8" } }
    };

    // Row 3 Headers
    const r3 = worksheet.getRow(3);
    r3.height = 28;
    const headers = ["S.NO", "TYPE", "FEATURE", "DESCRIPTION", "PRIORITY", "ASSIGNEE", "QA STATUS", "TASK ID", "TICKET STATUS", "NOTES"];
    headers.forEach((h, index) => {
      const cell = r3.getCell(index + 1);
      cell.value = h;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } }; // Navy Blue
      cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FF475569" } },
        left: { style: "thin", color: { argb: "FF475569" } },
        bottom: { style: "medium", color: { argb: "FF0F172A" } },
        right: { style: "thin", color: { argb: "FF475569" } }
      };
    });

    // Populate Data Rows starting at Row 4
    entries.forEach((item, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        type: item.type || "Bug",
        feature: item.feature || "",
        description: item.description || item.activity || "",
        priority: item.priority || "Medium",
        assignee: item.assignee || item.member || "",
        qaStatus: item.qaStatus || "Untested",
        taskId: item.taskId || item.ticketId || "",
        ticketStatus: item.ticketStatus || item.status || "Ongoing",
        notes: item.notes || item.comments || "",
      });

      row.height = 24;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // Font
        cell.font = {
          name: "Segoe UI",
          size: 10,
          color: { argb: "FF334155" }, // Slate-700
        };

        // Alignments
        // Center aligned: S.NO (col 1), Type (col 2), Priority (col 5), Assignee (col 6), QA Status (col 7), Task ID (col 8), Ticket Status (col 9).
        // Left aligned: Feature (col 3), Description (col 4), Notes (col 10).
        if (colNumber === 1 || colNumber === 2 || colNumber === 5 || colNumber === 6 || colNumber === 7 || colNumber === 8 || colNumber === 9) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        } else {
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };
        }

        // Borders
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };

        // Conditional Formatting for QA Status (Col 7)
        if (colNumber === 7) {
          const val = cell.value;
          if (val === "Passed") {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } }; // Emerald-100 bg
            cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF065F46" } }; // Emerald-800 text
          } else if (val === "Failed") {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } }; // Red-100 bg
            cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF991B1B" } }; // Red-800 text
          } else if (val === "Blocked") {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDF4E5" } }; // Amber-50 bg
            cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFB06000" } }; // Amber-800 text
          } else { // Untested
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } }; // slate-100 bg
            cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF64748B" } }; // slate-500 text
          }
        }

        // Conditional Formatting for Ticket Status (Col 9)
        if (colNumber === 9) {
          const val = cell.value;
          if (val === "Completed") {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } };
            cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF065F46" } };
          } else if (val === "Ongoing") {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDF4E5" } };
            cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFB06000" } };
          } else if (val === "Pending") {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } }; // Blue-100 bg
            cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF1E40AF" } }; // Blue-800 text
          } else if (val === "Blocked") {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
            cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF991B1B" } };
          }
        }
      });
    });

    // Write workbook to buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
    });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "JSDT Status.xlsx";
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate excel export:", error);
    alert("Export failed: " + error.message);
  }
};
