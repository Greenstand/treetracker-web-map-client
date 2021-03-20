/*
 * get entity, edit the DOM
 */
import axios from "axios";
const treetrackerApiUrl = process.env.REACT_APP_API || "/api/web/";

let isLoadingMarkers = false;


const entity = {
  name: "entity",
  getById: async function(id){
    const res = await axios.get(`${treetrackerApiUrl}entities/${id}`);
    if(res.status !== 200){
      throw Error("entity load fails");
    }
    return res.data;
  },
  getByWallet: async function(name){
    const res = await axios.get(`${treetrackerApiUrl}entities?wallet=${name}`);
    if(res.status !== 200){
      throw Error("entity load fails");
    }
    return res.data;
  },
  getByMapName: async function(name){
    const res = await axios.get(`${treetrackerApiUrl}entities?map_name=${name}`);
    if(res.status !== 200){
      throw Error("entity load fails");
    }
    return res.data;
  },
};

export default entity;
