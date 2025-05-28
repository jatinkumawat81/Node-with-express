class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
 
    filter(){
        const queryObj = { ...this.queryStr };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);

        this.query = this.query.find(queryObj);

        return this;
    }

    sort(){
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    limitFeild(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this
    }
    pagination(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1 || 2;
        const skip = (page - 1)*limit;
        this.query = this.query.skip(skip).limit(limit);

        // if(this.queryStr.page){
        //     const count = Movie.countDocuments();
        //     if(skip >= count){
        //         throw new Error("This page is not found!");
                
        //     }
        // }
        return this
    }
}

module.exports = ApiFeatures