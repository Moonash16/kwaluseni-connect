import { Member, Contribution, Loan, StockvelStats, calculateLoanDetails } from '@/types/stockvel';

// Seed members as specified
export const members: Member[] = [
  {
    id: '1',
    name: 'Andile Gwebu',
    email: 'andile.gwebu@email.com',
    phone: '+268 7612 3456',
    joinDate: new Date('2023-01-15'),
    status: 'active',
    riskLevel: 'low',
  },
  {
    id: '2',
    name: 'Junior Masuku',
    email: 'junior.masuku@email.com',
    phone: '+268 7623 4567',
    joinDate: new Date('2023-02-20'),
    status: 'active',
    riskLevel: 'low',
  },
  {
    id: '3',
    name: 'Munashe Matsanura',
    email: 'munashe.m@email.com',
    phone: '+268 7634 5678',
    joinDate: new Date('2023-03-10'),
    status: 'active',
    riskLevel: 'medium',
  },
  {
    id: '4',
    name: 'Mr Matsebula',
    email: 'matsebula@email.com',
    phone: '+268 7645 6789',
    joinDate: new Date('2023-01-05'),
    status: 'active',
    riskLevel: 'low',
  },
];

// Generate contribution history
const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];

export const contributions: Contribution[] = members.flatMap((member, memberIndex) =>
  months.map((month, monthIndex) => {
    // Create some variety in payment patterns
    const isPaid = monthIndex <= 10; // Current month might not be paid
    const isLate = member.riskLevel === 'medium' && monthIndex % 3 === 0;
    
    return {
      id: `${member.id}-${month}`,
      memberId: member.id,
      amount: 500, // E500 monthly contribution
      month,
      paidDate: isPaid ? new Date(`${month}-${isLate ? '25' : '05'}`) : null,
      isPaid: isPaid && monthIndex < 11,
    };
  })
);

// Sample loans
const loanDetails1 = calculateLoanDetails(3000, 6);
const loanDetails2 = calculateLoanDetails(8000, 12);
const loanDetails3 = calculateLoanDetails(15000, 12);

export const loans: Loan[] = [
  {
    id: 'loan-1',
    memberId: '1',
    memberName: 'Andile Gwebu',
    ...loanDetails1,
    principalAmount: loanDetails1.principal,
    status: 'active',
    requestDate: new Date('2024-06-01'),
    approvalDate: new Date('2024-06-03'),
    paidAmount: 1620, // Paid 3 months
  },
  {
    id: 'loan-2',
    memberId: '3',
    memberName: 'Munashe Matsanura',
    ...loanDetails2,
    principalAmount: loanDetails2.principal,
    status: 'active',
    requestDate: new Date('2024-04-15'),
    approvalDate: new Date('2024-04-18'),
    paidAmount: 4352, // Paid 6 months
  },
  {
    id: 'loan-3',
    memberId: '2',
    memberName: 'Junior Masuku',
    ...loanDetails3,
    principalAmount: loanDetails3.principal,
    status: 'repaid',
    requestDate: new Date('2023-06-01'),
    approvalDate: new Date('2023-06-05'),
    paidAmount: 17250,
  },
  {
    id: 'loan-4',
    memberId: '4',
    memberName: 'Mr Matsebula',
    ...calculateLoanDetails(2000, 4),
    principalAmount: 2000,
    status: 'pending',
    requestDate: new Date('2024-12-10'),
    paidAmount: 0,
  },
];

export const stockvelStats: StockvelStats = {
  totalSavings: 45600,
  totalMembers: 4,
  activeLoans: 2,
  totalLoansValue: 11000,
  monthlyContributionTarget: 2000, // 4 members × E500
  collectedThisMonth: 1500, // 3 out of 4 paid
};

// Helper functions
export function getMemberContributions(memberId: string): Contribution[] {
  return contributions.filter(c => c.memberId === memberId);
}

export function getMemberLoans(memberId: string): Loan[] {
  return loans.filter(l => l.memberId === memberId);
}

export function getMemberById(memberId: string): Member | undefined {
  return members.find(m => m.id === memberId);
}

export function getTotalContributionsByMember(memberId: string): number {
  return contributions
    .filter(c => c.memberId === memberId && c.isPaid)
    .reduce((sum, c) => sum + c.amount, 0);
}

export function getPaidMonthsCount(memberId: string): number {
  return contributions.filter(c => c.memberId === memberId && c.isPaid).length;
}

export function getOutstandingMonthsCount(memberId: string): number {
  return contributions.filter(c => c.memberId === memberId && !c.isPaid).length;
}
