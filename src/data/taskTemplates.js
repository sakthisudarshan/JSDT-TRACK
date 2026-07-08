const taskTemplates = [
  {
    type: "Task",
    feature: "Techniques/Metrics Research",
    description: "Verified technique metrics using official documentation.",
    priority: "Medium",
    qaStatus: "Passed",
    taskId: "JSDT-101",
    ticketStatus: "Completed",
    notes: "Validated with supporting evidence."
  },
  {
    type: "Bug",
    feature: "End-to-End Testing",
    description: "Performed end-to-end testing and verified functionality.",
    priority: "High",
    qaStatus: "Passed",
    taskId: "JSDT-102",
    ticketStatus: "Completed",
    notes: "No critical issues found."
  },
  {
    type: "Bug",
    feature: "JIRA Bug Verification",
    description: "Validated reported bugs and verified their status.",
    priority: "Critical",
    qaStatus: "Failed",
    taskId: "JSDT-103",
    ticketStatus: "Ongoing",
    notes: "Updated in Jira. Some bugs require regression testing."
  }
];

export default taskTemplates;