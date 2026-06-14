async function paginate(queryOrModel, page = 1, limit = 20) {
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 20;
  const skip = (page - 1) * limit;
  const query = typeof queryOrModel.skip === 'function' ? queryOrModel : queryOrModel.find();
  const [items, total] = await Promise.all([
    query.skip(skip).limit(limit).lean(),
    // estimate total by counting query conditions if possible
    query.model.countDocuments(query.getQuery ? query.getQuery() : {})
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

module.exports = { paginate };
