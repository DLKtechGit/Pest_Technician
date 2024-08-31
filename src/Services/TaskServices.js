import https from "./Https";
const TaskListUrl = 'task/getTasks';
const GetCompletedTask = 'task/getcompletedTasks/';
const UpdateOtherTechnicianURL = 'task/updateTaskOtherTechnicianName';
const UpdateTaskStatusURL = 'task/updateTaskStatus';
const UpdatePauseReasonURL = 'task/updatePausedetails';
const UpdateCompletedStatusURL = 'task/updateCompletedStatus';
const GetTaskIDURL = 'task/getTask/';
const GetTasksbystartURL = 'task/getTasksbystart';
const GetServiceByNameUrl = '/services/getservice/byname'
const UpdateQrscannedURL = 'task/updateQrscannedStatus'
const GetTaskStatusURL = 'task/getTaskStatus/'
const technicianTaskUrl = "task/getTasks"
const updateQrCodeCompletedStatusUrl = "task/updateQrCodeCompletedStatus"
const UpdateSubCategoryStatusUrl = "task/updateSubCategoryStatus"
const GetSubCategoryStatusWithFalseStatusUrl = "task/getSubCategoryStatusWithFalseStatus"
const updateNoQRSubCategoryStatusUrl = "task/updateNoQRSubCategoryStatus"
const getNoSubCategoryFalseStatusUrl = "task/getNoSubCategoryFalseStatus"
const UpdateSkipStatusURL = "task/updateSkipStatus"
const UpdateNoQrSkipStatusURL = "task/updateNoQrSkipStatus"
const UpdateRodentSkipStatusURL = "task/updateRodentSkipStatus"
const GetRodentSkipStatusfalseURL = "task/getRodentSkipStatusfalse"
const GetGeneralFalseStatusURL = "task/getGeneralFalseStatus"
const GetNoQrGeneralFalseStatusURL = "task/getNoQrGeneralFalseStatus"
const GetRodentQrTrueURL = "task/getRodentQrTrue"
const UpdateRodentStatusMainURL = "task/updateRodentStatusMain"
const GetGeneraltrueStatusURL = "task/getGeneraltrueStatus"
const GetNoQrGeneraltrueStatusURL = "task/getNoQrGeneraltrueStatus"
const GetRodentStatusURL = "task/getRodentStatus"
const pauseDurationTimeUrl = "task/pauseduration"
const getTaskByCustoomerIdUrl = "task/getTaskByCustomerId/"

const TaskList = (data) => {
    return https.Get(TaskListUrl, data);
}

const CompletedTask = (data) => {     
    return https.Get(GetCompletedTask,data); 
}

const UpdateOtherTechnician = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateOtherTechnicianURL,data); 
}

const UpdateStatus = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateTaskStatusURL,data); 
}
const UpdateQrscanned = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateQrscannedURL,data); 
}

const UpdateCompeletdStatus = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateCompletedStatusURL,data); 
}
const UpdateQrCodeCompletedStatus = (data) => {     
    // console.log("data",data);
    return https.Post(updateQrCodeCompletedStatusUrl,data); 
}
const UpdateNoQRSubCategoryStatus = (data) => {     
    // console.log("data",data);
    return https.Post(updateNoQRSubCategoryStatusUrl,data); 
}

const GetTaskByID = (data) => {     
    return https.Get(GetTaskIDURL,data); 
}
const GetStartTasks = (data) => {     
    return https.Get(GetTasksbystartURL,data); 
}
const GetRodentStatus = (data) => {     
    return https.Post(GetRodentStatusURL,data); 
}

const GetServicebyName = (data)=>{
    return https.Get(GetServiceByNameUrl,data)
}
const GetTaskStatus = (data)=>{
    return https.Get(GetTaskStatusURL,data)
}
const technicianTask = (data) => {
    return https.Get(technicianTaskUrl, data)
}
const UpdateSubCategoryStatus = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateSubCategoryStatusUrl,data); 
}

const GetSubCategoryStatusWithFalseStatus = (data)=>{
    return https.Get(GetSubCategoryStatusWithFalseStatusUrl,data)
}
const GetNoSubCategoryFalseStatus = (data)=>{
    return https.Get(getNoSubCategoryFalseStatusUrl,data)
}
const UpdateSkipStatus = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateSkipStatusURL,data); 
}
const UpdateNoQrSkipStatus = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateNoQrSkipStatusURL,data); 
}
const UpdateRodentSkipStatus = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateRodentSkipStatusURL,data); 
}
const GetRodentSkipStatusfalse = (data) => {     
    // console.log("data",data);
    return https.Post(GetRodentSkipStatusfalseURL,data); 
}
const GetGeneralFalseStatus = (data) => {     
    // console.log("data",data);
    return https.Post(GetGeneralFalseStatusURL,data); 
}
const GetNoQrGeneralFalseStatus = (data) => {     
    // console.log("data",data);
    return https.Post(GetNoQrGeneralFalseStatusURL,data); 
}
const GetGeneraltrueStatus = (data) => {     
    // console.log("data",data);
    return https.Post(GetGeneraltrueStatusURL,data); 
}
const GetNoQrGeneraltrueStatus = (data) => {     
    // console.log("data",data);
    return https.Post(GetNoQrGeneraltrueStatusURL,data); 
}
const GetRodentQrTrue = (data) => {     
    // console.log("data",data);
    return https.Post(GetRodentQrTrueURL,data); 
}
const UpdateRodentStatusMain = (data) => {     
    // console.log("data",data);
    return https.Post(UpdateRodentStatusMainURL,data); 
}
const UpdatePauseReason = (data)=>{
    return https.Post(UpdatePauseReasonURL,data)
}

const PasuseDurationTime = (data)=>{
    return https.Post(pauseDurationTimeUrl,data)
}

const getTaskByCustomerId = (data)=>{
    return https.Post(getTaskByCustoomerIdUrl,data)
}

export default {
    TaskList: TaskList,
    CompletedTask: CompletedTask,
    UpdateOtherTechnician:UpdateOtherTechnician,
    UpdateStatus:UpdateStatus,
    UpdateCompeletdStatus:UpdateCompeletdStatus,
    GetTaskByID:GetTaskByID,
    GetStartTasks:GetStartTasks,
    GetServicebyName:GetServicebyName,
    UpdateQrscanned:UpdateQrscanned,
    GetTaskStatus:GetTaskStatus,
    technicianTask:technicianTask,
    UpdateQrCodeCompletedStatus:UpdateQrCodeCompletedStatus,
    UpdateSubCategoryStatus:UpdateSubCategoryStatus,
    GetSubCategoryStatusWithFalseStatus:GetSubCategoryStatusWithFalseStatus,
    UpdateNoQRSubCategoryStatus:UpdateNoQRSubCategoryStatus,
    GetNoSubCategoryFalseStatus:GetNoSubCategoryFalseStatus,
    UpdateSkipStatus:UpdateSkipStatus,
    UpdateNoQrSkipStatus:UpdateNoQrSkipStatus,
    GetNoQrGeneralFalseStatus:GetNoQrGeneralFalseStatus,
    UpdateRodentSkipStatus:UpdateRodentSkipStatus,
    GetRodentSkipStatusfalse:GetRodentSkipStatusfalse,
    GetNoQrGeneraltrueStatus:GetNoQrGeneraltrueStatus,
    GetGeneralFalseStatus:GetGeneralFalseStatus,
    GetRodentQrTrue:GetRodentQrTrue,
    UpdateRodentStatusMain:UpdateRodentStatusMain,
    GetGeneraltrueStatus:GetGeneraltrueStatus,
    GetRodentStatus:GetRodentStatus,
    UpdatePauseReason:UpdatePauseReason,
    PasuseDurationTime:PasuseDurationTime,
    getTaskByCustomerId:getTaskByCustomerId
};


//  before leaving the office i reporting my daily work details to prasath ,rajkumar and i updating my work sheet as well without reporting and without my daily task  completing im not leaving the office daily
