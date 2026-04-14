from collections import defaultdict
from decimal import Decimal


def optimize_debts(balances):
    net = defaultdict(Decimal)

    for (debtor, creditor), amount in balances.items():
        net[debtor] -= amount
        net[creditor] += amount

    debtors = []
    creditors = []

    for person, amount in net.items():
        if amount < 0:
            debtors.append([person, -amount])
        elif amount > 0:
            creditors.append([person, amount])

    i, j = 0, 0
    result = []

    while i < len(debtors) and j < len(creditors):
        d_id, d_amt = debtors[i]
        c_id, c_amt = creditors[j]

        settled = min(d_amt, c_amt)

        result.append((d_id, c_id, settled))

        debtors[i][1] -= settled
        creditors[j][1] -= settled

        if debtors[i][1] == 0:
            i += 1
        if creditors[j][1] == 0:
            j += 1

    return result
