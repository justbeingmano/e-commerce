export const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const data = await model.find(query)
    .sort(options.sort || {})
    .skip(skip)
    .limit(limit);

  const total = await model.countDocuments(query);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    count: data.length,
    data,
  };
};