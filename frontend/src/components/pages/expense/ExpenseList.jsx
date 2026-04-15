import ExpenseCard from "./ExpenseCard";
import ExpenseTable from "./ExpenseTable";

export default function ExpenseList({
    data,
    formatCurrency,
    formatDate,
    onEdit,
    onDelete,
}) {
    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block">
                <ExpenseTable
                    data={data}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    onEdit={onEdit}        
                    onDelete={onDelete}    
                />
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
                {data.map((expense) => (
                    <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        onEdit={onEdit}       
                        onDelete={onDelete}   
                    />
                ))}
            </div>
        </>
    );
}