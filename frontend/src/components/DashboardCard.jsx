function DashboardCard({title,value,color='text black'}){
    return (
      <div className="bg-white shadow rounded-lg p-5 h-32">
        <p className="text-gray-500 text-sm">
            {title}
        </p>
        <h2 className={`text-3xl font-bold mt-3 ${color}`}>
            {value}
        </h2>
      </div>
    );
}
export default DashboardCard;