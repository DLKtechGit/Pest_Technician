import http from "./Https";
const IssuesUrl = "issuesApi/issues"
const GetIssuesByIdUrl = "issuesApi/getIssuesById/"

const CreateIssues = (data) =>{
    return http.Post(IssuesUrl,data)
}

const GetUserIdByIssues = (data) =>{
    return http.Get(GetIssuesByIdUrl,data)
}


export default {
    CreateIssues:CreateIssues,
    GetUserIdByIssues:GetUserIdByIssues
};