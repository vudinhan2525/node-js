class APIFeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const queryObj = { ...this.queryString };
        const excludedFields = ['sort', 'page', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        // 2) Advance filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte|in)\b/g,
            (match) => `$${match}`,
        );
        // Doing
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortCmp = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortCmp);
        }
        return this;
    }

    fields() {
        if (this.queryString.fields) {
            const fieldCmp = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fieldCmp);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
module.exports = APIFeature;
