import _ from 'lodash';
export default (result) => {
    try {
        result = _.isString(result) ? JSON.parse(result) : result;
        if (_.size(_.get(result, 'errors'))) {
            result.message = _.get(result, 'errors[0].extensions.code') || ('Lỗi kết nối api');
            return result;
        }
    } catch (error) {
        result.message = ('Lỗi kết nối api');
    }
    return result;
}