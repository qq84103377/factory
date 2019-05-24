import * as api from './api';
import * as myReportApi from './myReport/myReportApi';
import * as reportRecord from './reportRecord';
import * as material from './material';
import * as commonNodeReport from './nodeReport';
import * as outsideFactory from "./outsideFactory";
import * as nodeDetailApi from './node-detail';

// export default api;
module.exports = {
    ...api,
    ...myReportApi,
    ...reportRecord,
    ...material,
    ...outsideFactory,
    ...commonNodeReport,
    ...nodeDetailApi
}