export type RiskLevel = 'low' | 'medium' | 'high';

export type LoanStatus = 'pending' | 'approved' | 'active' | 'repaid' | 'overdue';

export type MembershipStatus = 'pending' | 'active' | 'suspended';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  status: MembershipStatus;
  riskLevel: RiskLevel;
  avatar?: string;
}

export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  month: string; // Format: "2024-01"
  paidDate: Date | null;
  isPaid: boolean;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  principalAmount: number;
  interestRate: number;
  totalRepayment: number;
  monthlyPayment: number;
  termMonths: number;
  status: LoanStatus;
  requestDate: Date;
  approvalDate?: Date;
  paidAmount: number;
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  paidDate: Date;
  month: number;
}

export interface StockvelStats {
  totalSavings: number;
  totalMembers: number;
  activeLoans: number;
  totalLoansValue: number;
  monthlyContributionTarget: number;
  collectedThisMonth: number;
}

// Staggered interest calculation
export function calculateLoanInterest(amount: number): number {
  if (amount <= 1000) return 5;
  if (amount <= 5000) return 8;
  if (amount <= 10000) return 12;
  if (amount <= 25000) return 15;
  return 18;
}

export function calculateLoanDetails(principal: number, termMonths: number = 12) {
  const interestRate = calculateLoanInterest(principal);
  const totalInterest = (principal * interestRate) / 100;
  const totalRepayment = principal + totalInterest;
  const monthlyPayment = totalRepayment / termMonths;

  return {
    principal,
    interestRate,
    totalInterest,
    totalRepayment,
    monthlyPayment,
    termMonths,
  };
}
