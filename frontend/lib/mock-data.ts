// Sample letter for demo
export const sampleLetter = `Dear Parent/Guardian,

Re: Outstanding School Fees and Excursion Payment - Action Required

We are writing to inform you that our records indicate an outstanding balance of $245.00 on your account for the 2024 academic year. This amount comprises:

1. Term 2 Activity Fee: $75.00 (Due: March 15, 2024)
2. Science Camp Deposit: $120.00 (Due: April 1, 2024)  
3. Library Resource Fee: $50.00 (Due: March 30, 2024)

Please note that failure to clear the outstanding balance by April 10, 2024 may result in your child being unable to participate in the upcoming Science Camp scheduled for April 20-22, 2024.

Payment can be made via:
- Online portal: schoolpay.edu/payments
- Direct deposit: BSB 123-456, Account 78901234
- School office (cash or card) during business hours

If you are experiencing financial difficulties, please contact our office at (02) 9876 5432 to discuss a payment plan. All communications will be treated confidentially.

Please retain this letter for your records and contact us if you believe there is an error in the charges listed.

Yours sincerely,
Mrs. Jennifer Walsh
Business Manager
Riverside Secondary College`;

// Mock API response (kept for reference; not used by the live API call)
export const mockAnalysisResponse = {
  summary:
    "This is a school fee reminder letter from Riverside Secondary College requesting payment of $245.00 in outstanding fees. The balance includes activity fees, a science camp deposit, and library fees. Payment is required by April 10, 2024 to ensure your child can participate in the upcoming Science Camp.",
  key_points: [
    "Total outstanding balance is $245.00",
    "Science Camp participation depends on payment by April 10",
    "Payment plans available for financial hardship",
    "Multiple payment methods accepted (online, bank transfer, in-person)",
  ],
  actions: [
    { id: "1", text: "Pay outstanding balance of $245.00", tag: "Pay" },
    {
      id: "2",
      text: "Contact school office if you believe charges are incorrect",
      tag: "Call",
    },
    {
      id: "3",
      text: "Request payment plan if experiencing financial difficulties",
      tag: "Call",
    },
    { id: "4", text: "Keep letter for your records", tag: "Docs" },
    { id: "5", text: "Complete Science Camp consent form", tag: "Submit" },
  ],
  deadlines: [
    { date: "2024-03-15", label: "Term 2 Activity Fee Due", confidence: "high" as const },
    { date: "2024-03-30", label: "Library Resource Fee Due", confidence: "high" as const },
    { date: "2024-04-01", label: "Science Camp Deposit Due", confidence: "high" as const },
    { date: "2024-04-10", label: "Final Payment Deadline", confidence: "high" as const },
    { date: "2024-04-20", label: "Science Camp Begins", confidence: "medium" as const },
  ],
  reply_draft: `Dear Mrs. Walsh,

Thank you for your letter dated [DATE] regarding the outstanding balance on my account.

I acknowledge the outstanding amount of $245.00 and would like to confirm that I will arrange payment by April 10, 2024.

[OPTION: If requesting payment plan]
Due to current financial circumstances, I would appreciate the opportunity to discuss a payment plan. Please advise your availability for a confidential discussion.

[OPTION: If disputing charges]
I believe there may be an error in the charges listed. Specifically, [describe issue]. I would appreciate if you could review this and contact me to clarify.

Please feel free to contact me at [YOUR PHONE] or [YOUR EMAIL] if you require any further information.

Kind regards,
[YOUR NAME]
Parent/Guardian of [CHILD'S NAME]`,
};

// Mock history data
export const mockHistoryData = [
  {
    id: "1",
    title: "School Fees Reminder",
    date: "2024-03-08",
    status: "analyzed" as const,
    preview: "Outstanding balance of $245.00...",
  },
  {
    id: "2",
    title: "Council Rate Notice",
    date: "2024-03-05",
    status: "analyzed" as const,
    preview: "Annual rates assessment for 2024...",
  },
  {
    id: "3",
    title: "Insurance Renewal",
    date: "2024-03-01",
    status: "analyzed" as const,
    preview: "Your policy expires on April 15...",
  },
  {
    id: "4",
    title: "Parking Fine Notice",
    date: "2024-02-28",
    status: "pending" as const,
    preview: "Infringement notice #12345...",
  },
];

// Types
export interface AnalysisResult {
  summary: string;
  key_points: string[];
  actions: { id: string; text: string; tag: string }[];
  deadlines: { date: string; label: string; confidence: "high" | "medium" | "low" }[];
  reply_draft: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  status: "analyzed" | "pending" | "error";
  preview: string;
}

// Live API function – calls your FastAPI backend


// // Sample letter for demo
// export const sampleLetter = `Dear Parent/Guardian,

// Re: Outstanding School Fees and Excursion Payment - Action Required

// We are writing to inform you that our records indicate an outstanding balance of $245.00 on your account for the 2024 academic year. This amount comprises:

// 1. Term 2 Activity Fee: $75.00 (Due: March 15, 2024)
// 2. Science Camp Deposit: $120.00 (Due: April 1, 2024)  
// 3. Library Resource Fee: $50.00 (Due: March 30, 2024)

// Please note that failure to clear the outstanding balance by April 10, 2024 may result in your child being unable to participate in the upcoming Science Camp scheduled for April 20-22, 2024.

// Payment can be made via:
// - Online portal: schoolpay.edu/payments
// - Direct deposit: BSB 123-456, Account 78901234
// - School office (cash or card) during business hours

// If you are experiencing financial difficulties, please contact our office at (02) 9876 5432 to discuss a payment plan. All communications will be treated confidentially.

// Please retain this letter for your records and contact us if you believe there is an error in the charges listed.

// Yours sincerely,
// Mrs. Jennifer Walsh
// Business Manager
// Riverside Secondary College`;

// // Mock API response
// export const mockAnalysisResponse = {
//   summary: "This is a school fee reminder letter from Riverside Secondary College requesting payment of $245.00 in outstanding fees. The balance includes activity fees, a science camp deposit, and library fees. Payment is required by April 10, 2024 to ensure your child can participate in the upcoming Science Camp.",
//   key_points: [
//     "Total outstanding balance is $245.00",
//     "Science Camp participation depends on payment by April 10",
//     "Payment plans available for financial hardship",
//     "Multiple payment methods accepted (online, bank transfer, in-person)"
//   ],
//   actions: [
//     { id: "1", text: "Pay outstanding balance of $245.00", tag: "Pay" },
//     { id: "2", text: "Contact school office if you believe charges are incorrect", tag: "Call" },
//     { id: "3", text: "Request payment plan if experiencing financial difficulties", tag: "Call" },
//     { id: "4", text: "Keep letter for your records", tag: "Docs" },
//     { id: "5", text: "Complete Science Camp consent form", tag: "Submit" }
//   ],
//   deadlines: [
//     { date: "2024-03-15", label: "Term 2 Activity Fee Due", confidence: "high" as const },
//     { date: "2024-03-30", label: "Library Resource Fee Due", confidence: "high" as const },
//     { date: "2024-04-01", label: "Science Camp Deposit Due", confidence: "high" as const },
//     { date: "2024-04-10", label: "Final Payment Deadline", confidence: "high" as const },
//     { date: "2024-04-20", label: "Science Camp Begins", confidence: "medium" as const }
//   ],
//   reply_draft: `Dear Mrs. Walsh,

// Thank you for your letter dated [DATE] regarding the outstanding balance on my account.

// I acknowledge the outstanding amount of $245.00 and would like to confirm that I will arrange payment by April 10, 2024.

// [OPTION: If requesting payment plan]
// Due to current financial circumstances, I would appreciate the opportunity to discuss a payment plan. Please advise your availability for a confidential discussion.

// [OPTION: If disputing charges]
// I believe there may be an error in the charges listed. Specifically, [describe issue]. I would appreciate if you could review this and contact me to clarify.

// Please feel free to contact me at [YOUR PHONE] or [YOUR EMAIL] if you require any further information.

// Kind regards,
// [YOUR NAME]
// Parent/Guardian of [CHILD'S NAME]`
// };

// // Mock history data
// export const mockHistoryData = [
//   {
//     id: "1",
//     title: "School Fees Reminder",
//     date: "2024-03-08",
//     status: "analyzed" as const,
//     preview: "Outstanding balance of $245.00..."
//   },
//   {
//     id: "2", 
//     title: "Council Rate Notice",
//     date: "2024-03-05",
//     status: "analyzed" as const,
//     preview: "Annual rates assessment for 2024..."
//   },
//   {
//     id: "3",
//     title: "Insurance Renewal",
//     date: "2024-03-01",
//     status: "analyzed" as const,
//     preview: "Your policy expires on April 15..."
//   },
//   {
//     id: "4",
//     title: "Parking Fine Notice",
//     date: "2024-02-28",
//     status: "pending" as const,
//     preview: "Infringement notice #12345..."
//   }
// ];

// // Types
// export interface AnalysisResult {
//   summary: string;
//   key_points: string[];
//   actions: { id: string; text: string; tag: string }[];
//   deadlines: { date: string; label: string; confidence: "high" | "medium" | "low" }[];
//   reply_draft: string;
// }

// export interface HistoryItem {
//   id: string;
//   title: string;
//   date: string;
//   status: "analyzed" | "pending" | "error";
//   preview: string;
// }

// // Mock API function
// export async function analyzeText(
//   text: string,
//   options: {
//     includeSummary: boolean;
//     includeChecklist: boolean;
//     includeDeadlines: boolean;
//     includeReply: boolean;
//   }
// ): Promise<AnalysisResult> {
//   // Simulate network delay (800-1200ms)
//   const delay = 800 + Math.random() * 400;
//   await new Promise(resolve => setTimeout(resolve, delay));
  
//   // Return mock response (in real app, this would call an API)
//   return mockAnalysisResponse;
// }


export async function analyzeText(
  text: string,
  options: {
    includeSummary: boolean;
    includeChecklist: boolean;
    includeDeadlines: boolean;
    includeReply: boolean;
  }
): Promise<AnalysisResult> {
  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      includeSummary: options.includeSummary,
      includeChecklist: options.includeChecklist,
      includeDeadlines: options.includeDeadlines,
      includeReply: options.includeReply,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze letter");
  }

  const data = await response.json();
  return data as AnalysisResult;
}