import http from "./Https";
const getChemicalsUrl = "chemicals/getChemicals"

const GetChemicals = (data) =>{
    return http.Get(getChemicalsUrl,data)
}

export default {
    GetChemicals:GetChemicals,
};