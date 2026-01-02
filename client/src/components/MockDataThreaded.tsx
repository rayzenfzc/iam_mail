// Threaded email data for conversation view
export const MOCK_INBOX_THREADED = [
  { 
    id: 1, 
    sender: 'Sloane Vanderbilt', 
    subject: 'Q4 Strategic Resource Allocation', 
    time: '14:02 PM', 
    status: 'URGENT',
    messages: [
      { sender: 'Sloane Vanderbilt', senderRole: 'Executive Lead', time: '12:05 PM', body: "The quarterly review is attached. Please review the preliminary figures for the board meeting on Friday. We noticed a discrepancy in sector 7 allocations.", attachments: [{ name: 'Q4_Report.pdf', size: '2.4MB' }] },
      { sender: 'Me', senderRole: 'Account Manager', time: '12:42 PM', body: "Acknowledged. I see the discrepancy in sector 7. The allocation shows 15% but budget document shows 18%. Which is correct?" },
      { sender: 'Sloane Vanderbilt', senderRole: 'Executive Lead', time: '13:10 PM', body: "Good catch. The 18% figure is correct. The report had a data sync error. I'll send the corrected version." },
      { sender: 'Me', senderRole: 'Account Manager', time: '13:25 PM', body: "I'll update the board deck with the corrected figures. Should be ready by EOD." },
      { sender: 'System Alert', senderRole: 'Automated', time: '13:50 PM', body: "Document Updated: Q4_Report_v2.pdf uploaded to shared drive. All stakeholders notified." },
      { sender: 'Sloane Vanderbilt', senderRole: 'Executive Lead', time: '14:02 PM', body: "Perfect. The updated report is live. Thanks for catching that before the board meeting.", attachments: [{ name: 'Q4_Report_v2.pdf', size: '2.4MB' }] }
    ]
  },
  { 
    id: 2, 
    sender: 'Julian Sterling', 
    subject: 'Dubai Region Quarterly Targets', 
    time: '09:15 AM', 
    status: 'UNREAD',
    messages: [
      { sender: 'Julian Sterling', senderRole: 'Senior Analyst', time: '09:15 AM', body: "The targets for the upcoming quarter have been finalized. Please coordinate with the local teams. Attached are the detailed breakdowns by region and product line.", attachments: [{ name: 'Q1_Targets.xlsx', size: '1.8MB' }] }
    ]
  },
  { 
    id: 3, 
    sender: 'Amara Khan', 
    subject: 'Capacity Warning: Server 7', 
    time: 'Yesterday', 
    status: 'READ',
    messages: [
      { sender: 'System Monitor', senderRole: 'Automated', time: '08:00 AM', body: "Storage capacity has reached 85%. Automated cleanup protocols will initiate at 90%." },
      { sender: 'Amara Khan', senderRole: 'CTO', time: '08:15 AM', body: "I'm reviewing the storage usage patterns. Most of the space is taken by old log files. Running cleanup now." },
      { sender: 'Me', senderRole: 'Account Manager', time: '08:30 AM', body: "Should we schedule the server expansion we discussed last month?" },
      { sender: 'Amara Khan', senderRole: 'CTO', time: 'Yesterday', body: "Yes, let's proceed. I'll send the specs and budget estimate by EOD." }
    ]
  },
  { 
    id: 4, 
    sender: 'HM Revenue', 
    subject: 'Tax Compliance Audit Q3', 
    time: '11:00 AM', 
    status: 'URGENT',
    messages: [
      { sender: 'HM Revenue', senderRole: 'Tax Authority', time: '11:00 AM', body: "Please find attached the notification for the upcoming Q3 audit. All documentation must be submitted by January 15, 2025.", attachments: [{ name: 'Audit_Notice.pdf', size: '890KB' }] }
    ]
  },
  { 
    id: 5, 
    sender: 'Legal Dept', 
    subject: 'GDPR Policy Updates', 
    time: '08:30 AM', 
    status: 'UNREAD',
    messages: [
      { sender: 'Legal Dept', senderRole: 'Compliance', time: '08:30 AM', body: "New regulations regarding data retention have been passed. All teams must review and acknowledge the updated policies by end of week.", attachments: [{ name: 'GDPR_Updates_2025.pdf', size: '1.2MB' }] }
    ]
  }
];
