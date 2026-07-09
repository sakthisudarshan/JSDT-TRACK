import ExcelJS from "exceljs";

/**
 * Exports the provided status tracker entries list to a professionally styled Excel file.
 * Filename: JSDT Status.xlsx
 *
 * This exporter is intelligent:
 * 1. If all entries have type === "Task", it generates the "JSDT Task Metrics" sheet
 *    with merged names and techniques (matching the JSDT status sheet PDF).
 * 2. Otherwise, it generates the "Bug Tracking Dashboard" sheet (matching the bug tracker PDF).
 */
export const exportToExcel = async (entries) => {
  if (!entries || entries.length === 0) {
    alert("No entries to export.");
    return;
  }

  // Check if this is a Task-only list
  const isTaskExport = entries.every((e) => e.type === "Task");

  try {
    const workbook = new ExcelJS.Workbook();

    if (isTaskExport) {
      // --- LAYOUT A: JSDT TASK METRICS SHEET ---
      const worksheet = workbook.addWorksheet("TASK TRACKER");
      worksheet.views = [{ showGridLines: true }];

      // Column widths
      worksheet.columns = [
        { key: "name", width: 22 },
        { key: "technique", width: 30 },
        { key: "metricsCount", width: 16 },
        { key: "jiraId", width: 16 },
        { key: "status", width: 18 },
        { key: "comments", width: 45 },
      ];

      // Style Row 1 Headers (Date, Completion Rate, Total Metrics, Total Completed, TOOL)
      const r1 = worksheet.getRow(1);
      r1.height = 24;
      const topHeaders = ["Date", "Completion Rate", "Total Metrics", "Total Completed", "TOOL"];
      topHeaders.forEach((th, idx) => {
        const cell = r1.getCell(idx + 1);
        cell.value = th;
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008080" } }; // Teal
        cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FF004D4D" } },
          left: { style: "thin", color: { argb: "FF004D4D" } },
          bottom: { style: "thin", color: { argb: "FF004D4D" } },
          right: { style: "thin", color: { argb: "FF004D4D" } }
        };
      });

      // Fixed names and techniques matrix
      const membersData = [
        {
          name: "AARTHI VISHAKHA",
          techniques: ["CROSSHAIR", "RANDON/LIZARD", "TESTMON", "BENNIGET", "PRIMARY"]
        },
        {
          name: "SAKTHI SUDHARSHAN",
          techniques: ["PYLINT", "COSMIC RAY", "COGNITIVE-AST", "PYDRILLER", "JSCPD"]
        },
        {
          name: "VISVANTHA",
          techniques: ["COVERAGE.PY", "COVERAGE.PY+BENIGET", "PIP AUDIT", "SEMGREP+OSS", "PYMCDC"]
        }
      ];

      // Statistics calculations from lookup
      let completedCount = 0;
      let totalMetricsCount = 0;

      membersData.forEach((member) => {
        member.techniques.forEach((tech) => {
          const match = entries.find((e) => 
            (e.assignee || e.member || "").toLowerCase().trim() === member.name.toLowerCase().trim() &&
            (e.feature || e.task || "").toUpperCase().trim() === tech.toUpperCase().trim()
          );
          if (match) {
            const statusVal = (match.ticketStatus || match.status || "").toUpperCase();
            if (statusVal === "COMPLETED") {
              completedCount++;
            }
            if (match.metricsCount) {
              totalMetricsCount += parseInt(match.metricsCount) || 0;
            }
          }
        });
      });

      // Style Row 2 Values
      const dateVal = entries[0]?.date || new Date().toLocaleDateString("en-GB");
      const completionRateVal = ((completedCount / 15) * 100).toFixed(1) + "%";
      const totalCompletedVal = `${completedCount}/15`;

      const r2 = worksheet.getRow(2);
      r2.height = 24;
      r2.getCell(1).value = dateVal;
      r2.getCell(2).value = completionRateVal;
      r2.getCell(3).value = totalMetricsCount;
      r2.getCell(4).value = totalCompletedVal;
      r2.getCell(5).value = "PYTHON";

      for (let c = 1; c <= 5; c++) {
        const cell = r2.getCell(c);
        cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF334155" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } }; // Slate-100 bg
        cell.border = {
          top: { style: "thin", color: { argb: "FFCBD5E1" } },
          left: { style: "thin", color: { argb: "FFCBD5E1" } },
          bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
          right: { style: "thin", color: { argb: "FFCBD5E1" } }
        };
      }

      // Style Row 3 Headers (NAME, TECHNIQUE, METRICS COUNT, JIRA ID, STATUS, COMMENTS)
      const r3 = worksheet.getRow(3);
      r3.height = 28;
      const dataHeaders = ["NAME", "TECHNIQUE", "METRICS COUNT", "JIRA ID", "STATUS", "COMMENTS"];
      dataHeaders.forEach((dh, idx) => {
        const cell = r3.getCell(idx + 1);
        cell.value = dh;
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008080" } }; // Teal
        cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FF004D4D" } },
          left: { style: "thin", color: { argb: "FF004D4D" } },
          bottom: { style: "medium", color: { argb: "FF003333" } },
          right: { style: "thin", color: { argb: "FF004D4D" } }
        };
      });

      // Write fixed rows
      let currentRowIndex = 4;
      membersData.forEach((member) => {
        const startRow = currentRowIndex;
        const endRow = currentRowIndex + member.techniques.length - 1;

        member.techniques.forEach((tech, techIdx) => {
          const row = worksheet.getRow(currentRowIndex);
          row.height = 24;

          if (techIdx === 0) {
            row.getCell(1).value = member.name;
          }
          row.getCell(2).value = tech;

          // Lookup entry
          const match = entries.find((e) => 
            (e.assignee || e.member || "").toLowerCase().trim() === member.name.toLowerCase().trim() &&
            (e.feature || e.task || "").toUpperCase().trim() === tech.toUpperCase().trim()
          );

          if (match) {
            row.getCell(3).value = match.metricsCount ? parseInt(match.metricsCount) : "";
            row.getCell(4).value = match.taskId || match.ticketId || "";
            row.getCell(5).value = (match.ticketStatus || match.status || "Ongoing").toUpperCase();
            row.getCell(6).value = match.notes || match.comments || "";
          } else {
            row.getCell(3).value = "";
            row.getCell(4).value = "";
            row.getCell(5).value = "YET TO START";
            row.getCell(6).value = "";
          }

          // Format cells
          for (let colNum = 1; colNum <= 6; colNum++) {
            const cell = row.getCell(colNum);
            cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF334155" } };
            
            if (colNum === 1 || colNum === 2 || colNum === 3 || colNum === 4 || colNum === 5) {
              cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
            } else {
              cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
            }

            cell.border = {
              top: { style: "thin", color: { argb: "FFE2E8F0" } },
              left: { style: "thin", color: { argb: "FFE2E8F0" } },
              bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
              right: { style: "thin", color: { argb: "FFE2E8F0" } }
            };

            // Status conditional fills
            if (colNum === 5) {
              const statusVal = cell.value.toString().toUpperCase();
              if (statusVal === "COMPLETED") {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } }; // emerald-100
                cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF065F46" } };
              } else if (statusVal === "YET TO START") {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } }; // slate-100
                cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF64748B" } };
              } else { // ONGOING / PENDING / BLOCKED
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDF4E5" } }; // amber-50
                cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF92400E" } };
              }
            }
          }

          currentRowIndex++;
        });

        // Merge cells vertically for name
        worksheet.mergeCells(`A${startRow}:A${endRow}`);
        const mergedCell = worksheet.getCell(`A${startRow}`);
        mergedCell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        mergedCell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF1E293B" } };
      });

    } else {
      // --- LAYOUT B: BUG TRACKING DASHBOARD SHEET ---
      const worksheet = workbook.addWorksheet("BUG TRACKING DASHBOARD");
      worksheet.views = [{ showGridLines: true }];

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
      
      const cellA1 = r1.getCell(1);
      cellA1.value = "Date";
      cellA1.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF1E3A8A" } };
      cellA1.alignment = { vertical: "middle", horizontal: "center" };
      cellA1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
      cellA1.border = {
        top: { style: "thin", color: { argb: "FF94A3B8" } },
        left: { style: "thin", color: { argb: "FF94A3B8" } },
        bottom: { style: "thin", color: { argb: "FF94A3B8" } },
        right: { style: "thin", color: { argb: "FF94A3B8" } }
      };

      worksheet.mergeCells("C1:J1");
      const titleCell = worksheet.getCell("C1");
      titleCell.value = "BUG TRACKING DASHBOARD";
      titleCell.font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } };
      titleCell.border = {
        top: { style: "thin", color: { argb: "FF475569" } },
        left: { style: "thin", color: { argb: "FF475569" } },
        bottom: { style: "thin", color: { argb: "FF475569" } },
        right: { style: "thin", color: { argb: "FF475569" } }
      };

      // Row 2
      const r2 = worksheet.getRow(2);
      r2.height = 20;
      
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

      // Row 3
      const r3 = worksheet.getRow(3);
      r3.height = 28;
      const headers = ["S.NO", "TYPE", "FEATURE", "DESCRIPTION", "PRIORITY", "ASSIGNEE", "QA STATUS", "TASK ID", "TICKET STATUS", "NOTES"];
      headers.forEach((h, index) => {
        const cell = r3.getCell(index + 1);
        cell.value = h;
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } };
        cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.border = {
          top: { style: "thin", color: { argb: "FF475569" } },
          left: { style: "thin", color: { argb: "FF475569" } },
          bottom: { style: "medium", color: { argb: "FF0F172A" } },
          right: { style: "thin", color: { argb: "FF475569" } }
        };
      });

      // Populate rows
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
          cell.font = {
            name: "Segoe UI",
            size: 10,
            color: { argb: "FF334155" },
          };

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

          cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } },
          };

          // QA Status colors
          if (colNumber === 7) {
            const val = cell.value;
            if (val === "Passed") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF065F46" } };
            } else if (val === "Failed") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF991B1B" } };
            } else if (val === "Blocked") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDF4E5" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFB06000" } };
            } else {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
              cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF64748B" } };
            }
          }

          // Ticket Status colors
          if (colNumber === 9) {
            const val = cell.value;
            if (val === "Completed") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF065F46" } };
            } else if (val === "Ongoing") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDF4E5" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFB06000" } };
            } else if (val === "Pending") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF1E40AF" } };
            } else if (val === "Blocked") {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF991B1B" } };
            }
          }
        });
      });
    }

    // Write file out
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
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate excel export:", error);
    alert("Export failed: " + error.message);
  }
};
