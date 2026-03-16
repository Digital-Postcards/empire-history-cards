interface EmpireFilterProps {
    selectedEmpire: string | null;
    onEmpireChange: (empire: string | null) => void;
    empires: string[];
}

const EmpireFilter = ({ selectedEmpire, onEmpireChange, empires }: EmpireFilterProps) => {
    return (
        <div className="mb-4">
            <label
                style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                }}>
                Filter by Empire
            </label>
            <select
                data-testid="empire-select"
                value={selectedEmpire || ""}
                onChange={(e) => onEmpireChange(e.target.value || null)}
                style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    fontSize: "14px",
                }}>
                <option value="">All Empires</option>
                {empires
                    .filter((empire) => empire !== "undefined")
                    .sort()
                    .map((empire) => (
                        <option key={empire} value={empire}>
                            {empire}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default EmpireFilter;
