const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

const getDashboardData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    const categories = await Category.find({ user: req.user._id });

    const insights = await Promise.all(
      categories.map(async (category) => {
        // Calculate total spent for the selected date range
        const totalSpent = await Transaction.aggregate([
          {
            $match: {
              category: category._id,
              user: req.user._id,
              date: {
                $gte: start,
                $lte: end,
              },
            },
          },
          {
            $group: {
              _id: "$category",
              totalSpent: { $sum: "$amount" },
            },
          },
        ]);

        // Calculate the total monthly budget for the selected date range
        const monthsInRange =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) +
          1;
        const totalBudget = category.budget * monthsInRange;

        return {
          categoryName: category.name,
          monthlyBudget: category.budget,
          totalBudget,
          totalSpent: totalSpent.length ? totalSpent[0].totalSpent : 0,
          overBudget: totalSpent.length
            ? totalSpent[0].totalSpent > totalBudget
            : false,
        };
      })
    );

    res.json(insights);
  } catch (error) {
    console.error("Failed to retrieve dashboard data:", error.message);
    res.status(500).json({ message: "Failed to retrieve dashboard data" });
  }
};

module.exports = {
  getDashboardData,
};
