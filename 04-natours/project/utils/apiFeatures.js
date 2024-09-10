export default class APIFeatures {
  constructor(model, req) {
    this.model = model;
    this.req = req;
  }

  filter() {
    const validQuery = ['difficulty', 'duration', 'price', 'ratingsAverage'];
    const specialOperators = ['gte', 'gt', 'lte', 'lt'];

    const queryParams = {};
    validQuery.forEach(q => {
      if (this.req.query[q] !== undefined) {
        let value = this.req.query[q];

        if (value instanceof Object)
          specialOperators.forEach(op => {
            if (value[op] !== undefined) {
              value = { ...value, [`$${op}`]: value[op] };
              delete value[op];
            }
          });

        queryParams[q] = value;
      }
    });
    // console.log(req.query, query);

    this.query = this.model.find(queryParams);
    return this;
  }

  sorting() {
    if (!this.req.query.sort)
      this.query = this.query.sort('-createdAt');
    else {
      const sortBy = this.req.query.sort.replace(',', ' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  fieldLimiting() {
    let fields = '';
    if (this.req.query.fields)
      fields = this.req.query.fields.replace(',', ' ');
    else
      fields = '-__v';
    this.query = this.query.select(fields);
    return this;
  }

  async pagination() {
    const page = parseInt(this.req.query.page) || 1;
    const limit = parseInt(this.req.query.limit) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    if (this.req.query.page) {
      const numTours = await this.model.countDocuments();

      if (skip >= numTours)
        throw new Error('This page does not exist');
    }
  }

  async get() {
    return await this.query;
  }
}
