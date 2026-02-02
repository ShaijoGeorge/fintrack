const WalletCard = ({ name, balance }) => {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{name}</h3>
            <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">₹ {parseFloat(balance).toLocaleString("en-IN")}</span>
            </div>
        </div>
    );
};

export default WalletCard;