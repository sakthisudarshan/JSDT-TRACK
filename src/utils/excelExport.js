import ExcelJS from "exceljs";

/**
 * Exports the provided status tracker entries list to a professionally styled Excel file.
 * Filename: JSDT Status.xlsx
 * Columns: Date, Member Name, Task Title, Activity, Status, Deliverable, Comments
 * Theme: Navy Headers, Light Slate Grid borders, Conditional colors for status cells.
 */
export const exportToExcel = async (entries) => {
  if (!entries || entries.length === 0) {
    alert("No entries to export.");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("JSDT Status Tracker");

    // Enable grid lines visibility explicitly
    worksheet.views = [{ showGridLines: true }];

    // Column Definitions and standard widths
    worksheet.columns = [
      { header: "Date", key: "date", width: 14 },
      { header: "Member Name", key: "member", width: 22 },
      { header: "Ticket ID", key: "ticketId", width: 15 },
      { header: "Task Title", key: "task", width: 30 },
      { header: "Activity", key: "activity", width: 45 },
      { header: "Status", key: "status", width: 15 },
      { header: "Deliverable", key: "deliverable", width: 35 },
      { header: "Comments", key: "comments", width: 30 },
    ];

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E3A8A" }, // Navy Blue Background
      };
      cell.font = {
        name: "Segoe UI",
        size: 11,
        bold: true,
        color: { argb: "FFFFFFFF" }, // White text
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF475569" } },
        left: { style: "thin", color: { argb: "FF475569" } },
        bottom: { style: "medium", color: { argb: "FF0F172A" } },
        right: { style: "thin", color: { argb: "FF475569" } },
      };
    });

    // Style Data Rows
    entries.forEach((item) => {
      const row = worksheet.addRow({
        date: item.date,
        member: item.member,
        ticketId: item.ticketId || "",
        task: item.task,
        activity: item.activity,
        status: item.status,
        deliverable: item.deliverable,
        comments: item.comments || "",
      });

      row.height = 24;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // Font
        cell.font = {
          name: "Segoe UI",
          size: 10,
          color: { argb: "FF334155" }, // Slate-700
        };

        // Alignments: Date, Member Name, Ticket ID, and Status (cols 1, 2, 3, 6) are centered.
        if (colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber === 6) {
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

        // Conditional Formatting for Status is now column index 6
        if (colNumber === 6) {
          const val = cell.value;
          if (val === "Completed") {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFD1FAE5" }, // Emerald-100 bg
            };
            cell.font = {
              name: "Segoe UI",
              size: 10,
              bold: true,
              color: { argb: "FF065F46" }, // Emerald-800 text
            };
          } else if (val === "Ongoing") {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FEF3C7" }, // Amber-100 bg
            };
            cell.font = {
              name: "Segoe UI",
              size: 10,
              bold: true,
              color: { argb: "FF92400E" }, // Amber-800 text
            };
          } else if (val === "Pending") {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFDBEAFE" }, // Blue-100 bg
            };
            cell.font = {
              name: "Segoe UI",
              size: 10,
              bold: true,
              color: { argb: "FF1E40AF" }, // Blue-800 text
            };
          } else if (val === "Blocked") {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FEE2E2" }, // Red-100 bg
            };
            cell.font = {
              name: "Segoe UI",
              size: 10,
              bold: true,
              color: { argb: "FF991B1B" }, // Red-800 text
            };
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
